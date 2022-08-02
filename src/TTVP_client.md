# Trusted Transaction Validation Protocol client

This is the client software embedded in an app or browser in the future that  enables the secure confirmation of any transactions or sensitive operation with an hardware level security.
(cf [Tusted Transaction Validation Protocol](./TTVP.md))

It implements the [Trusted Authentication and User Interface Layer](./TAUI.md) combined with [Harware-backed Mobile Key](./HBMK.md) and is regsitered in the [Mobile TEE Registry](./Mobile_Registry.md)

## Architecture and Security
![App architecture](./fig/App_architecture.svg)

> Green boxes are secure as well as garbled circuit evaluation in Dark Grey
it prevents state of the art Banking trojan attacks on the mobile

This client is based on a substrate client on the mobile to communicate through unsigned extrinsic with signed option and substrate events with the blockchain. It enables the mobile to be registered with the mobile TEE registry pallet. 


It also include an IPFS client to retrieve the cid of the [Visual Cryptography Display](./VC-GC.md) i.e the one-time [Garbled Circuit](,/GC.md) program generated for each transaction  by the [Garbled Circuit Factory](./GCF.md) managed by the blockchain.

The previous circuit is used to compose the [Trusted Authentication and User Interface Layer](./TAUI.md) i.e `Secure UI Screen` that evaluates and renders the circuit to enable the user to confirm a transaction/sensitive operation with a `one-time code`

This Secure UI layer relies on a garbled circuit evaluator and a renderer to display the result of its evaluation directly to the framebuffer.
## TTVP client components


Following are the main components of the mobile client
### Substrate Client

[wallet-app/shared/rust/substrate-client/src](https://github.com/Interstellar-Network/wallet-app/blob/master/shared/rust/substrate-client/src/lib.rs)

following are the main extrinsics used

#### `extrinsic_garble_and_strip_display_circuits_package_signed`
Get garbled Circuit package from ocwGarble pallet

```rust
fn extrinsic_garble_and_strip_display_circuits_package_signed(
    api: &Api<sp_core::sr25519::Pair, WsRpcClient>,
    tx_message: &str,
) 
```

#### `extrinsic_register_mobile`
send the mobile public key to be registered in the Mobile Registry pallet
```rust
pub fn extrinsic_register_mobile(
    api: &Api<sp_core::sr25519::Pair, WsRpcClient>,
    pub_key: Vec<u8>,
) 
```
#### `extrinsic_check_input`
check user input i.e one-time-code inputted on the randomized keypad
```rust
pub fn extrinsic_check_input(
    api: &Api<sp_core::sr25519::Pair, WsRpcClient>,
    ipfs_cid: Vec<u8>,
    input_digits: Vec<u8>,
) 
```

### Garble Circuit Evaluator
This is the high level part in rust that encapsulated calls to lower level C++ evaluator
```rust
pub use cxx;

use aes::cipher::{
    generic_array::{typenum::consts::U16, GenericArray},
    BlockEncrypt, KeyInit,
};
use aes::Aes128;

#[cxx::bridge]
pub mod ffi {

    // Rust types and signatures exposed to C++.
    extern "Rust" {
        type MyRustAes;

        unsafe fn encrypt_block(aes: &MyRustAes, low: &mut u64, high: &mut u64);

        /// param: key: usually a PGC's global_key field
        // Box<> else "returning opaque Rust type by value is not supported"
        unsafe fn init_aes(key_low: u64, key_high: u64) -> Box<MyRustAes>;
    }

    unsafe extern "C++" {
        include!("circuit-evaluate/src/rust_wrapper.h");

        type EvaluateWrapper;

        /// Create a new EvaluateWrapper, to be used later eg
        /// let evaluate_wrapper = ffi::new_evaluate_wrapper(...);
        /// evaluate_wrapper.EvaluateWithInputs(...); etc
        ///
        /// param: pgarbled_buffer can be a FULL, or a STRIPPED circuit
        /// typically in PROD we use STRIPPED ones, but for tests/dev we keep compat with FULL circuits
        /// [in which case] packmsg_buffer can be empty
        fn new_evaluate_wrapper(
            pgarbled_buffer: Vec<u8>,
            packmsg_buffer: Vec<u8>,
        ) -> UniquePtr<EvaluateWrapper>;

        /// PROD version
        /// inputs are randomized, outputs are externally given
        /// typically outputs points to some kind of "Texture data"
        fn EvaluateWithPackmsg(self: Pin<&mut EvaluateWrapper>, outputs: &mut Vec<u8>);
        /// TEST/DEV only
        /// PROD uses randomize inputs
        fn EvaluateWithPackmsgWithInputs(&self, inputs: Vec<u8>) -> Vec<u8>;
        /// TEST/DEV only
        /// PROD is using the PACKMSG version
        fn EvaluateWithInputs(&self, inputs: Vec<u8>) -> Vec<u8>;

        fn GetNbInputs(&self) -> usize;
        fn GetNbOutputs(&self) -> usize;
        fn GetWidth(&self) -> usize;
        fn GetHeight(&self) -> usize;
    }
}

/// We MUST impl Send+Sync b/c EvaluateWrapper is used as a Bevy's Resource
/// EvaluateWithPackmsg/etc use a "const" PGC so on that part we are thread safe
/// BUT EvaluateWithPackmsg in circuit_evaluate/src/rust_wrapper.cpp MAY NOT be thread safe
/// depending on where "outputs" are(eg NOT thread safe if a class field, thread safe if returning std::vector)
unsafe impl Send for ffi::EvaluateWrapper {}
unsafe impl Sync for ffi::EvaluateWrapper {}

pub struct MyRustAes {
    pub aes: Aes128,
}

pub fn encrypt_block(aes: &MyRustAes, low: &mut u64, high: &mut u64) {
    // init "block" from "high+low"
    // TODO or better instead of "high, low" params: rewrite to accept a param like "key: *const c_char" and use reinterpret_cast(&this) in block.h?
    let input_vec: Vec<u8> = if cfg!(target_endian = "big") {
        let mut v: Vec<u8> = vec![];
        v.extend(low.to_be_bytes());
        v.extend(high.to_be_bytes());
        v
    } else {
        let mut v: Vec<u8> = vec![];
        v.extend(low.to_le_bytes());
        v.extend(high.to_le_bytes());
        v
    };

    let mut block: GenericArray<u8, U16> = GenericArray::clone_from_slice(input_vec.as_slice());

    aes.aes.encrypt_block(&mut block);

    let low_arr: [u8; 8] = block.as_slice()[..8].try_into().expect("Wrong length");
    let high_arr: [u8; 8] = block.as_slice()[8..].try_into().expect("Wrong length");

    if cfg!(target_endian = "big") {
        *low = u64::from_be_bytes(low_arr);
        *high = u64::from_be_bytes(high_arr);
    } else {
        *low = u64::from_le_bytes(low_arr);
        *high = u64::from_le_bytes(high_arr);
    }
}

fn init_aes(key_low: u64, key_high: u64) -> Box<MyRustAes> {
    let key: Vec<u8> = if cfg!(target_endian = "big") {
        let mut v: Vec<u8> = vec![];
        v.extend(key_low.to_be_bytes());
        v.extend(key_high.to_be_bytes());
        v
    } else {
        let mut v: Vec<u8> = vec![];
        v.extend(key_low.to_le_bytes());
        v.extend(key_high.to_le_bytes());
        v
    };

    Box::new(MyRustAes {
        aes: Aes128::new_from_slice(&key).unwrap(),
    })
}
```
low level C++ garbled circuits evaluator part

[wallet-app/shared/rust/circuit_evaluate/src/cpp/](https://github.com/Interstellar-Network/wallet-app/tree/master/shared/rust/circuit_evaluate/src/cpp)

### Renderer
This is the layer in charge of writting the results of display circuits evaluation directly to the framebuffer through GPU shaders
[wallet-app/shared/rust/renderer](https://github.com/Interstellar-Network/wallet-app/tree/master/shared/rust/renderer)

`setup.rs` is one of the most critical part of the renderer, responsible for the creation of textures in which renderer will display the result of circuits evaluation/execution with GPU shaders
`setup.rs`
```rust
pub fn setup_pinpad_textures(
    mut commands: Commands,
    mut images: ResMut<Assets<Image>>,
    mut texture_atlas: ResMut<Assets<TextureAtlas>>,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials_color: ResMut<Assets<ColorMaterial>>,
    rects_pinpad: Res<crate::RectsPinpad>,
) {
    // TODO https://bevy-cheatbook.github.io/features/parent-child.html
    // circle is the parent, Texture is child

    /// WARNING it is assumed that the layout is one row of 10 "cases"
    let atlas_width = rects_pinpad.circuit_dimension[0];
    let atlas_height = rects_pinpad.circuit_dimension[1];

    // pinpad
    let atlas_handle = texture_atlas.add(TextureAtlas::from_grid(
        images.add(uv_debug_texture(atlas_width, atlas_height)),
        Vec2::new((atlas_width as f32) / 10., atlas_height as f32),
        10,
        1,
    ));
    // draw a sprite from the atlas
    for row in 0..rects_pinpad.nb_rows {
        for mut col in 0..rects_pinpad.nb_cols {
            // on index = 9, we want to draw in the BOTTOM CENTER; which is why we move "col++"
            // TODO proper index directly(ie without "if"): exclude lower left(cancel button) and lower right(done button)
            let index = col + row * rects_pinpad.nb_cols;
            if index == 9 {
                col = col + 1;
            } else if index >= 10 {
                break;
            }

            let current_rect = &rects_pinpad.rects[[row, col]];

            let center_x = current_rect.center()[0];
            let center_y = current_rect.center()[1];

            commands.spawn_bundle(SpriteSheetBundle {
                transform: Transform {
                    translation: Vec3::new(center_x, center_y, 1.0),
                    ..default()
                },
                sprite: TextureAtlasSprite {
                    index: index,
                    custom_size: Some(Vec2::new(
                        current_rect.width() / 2.0,
                        current_rect.height() / 2.0,
                    )),
                    color: rects_pinpad.text_color,
                    ..default()
                },
                texture_atlas: atlas_handle.clone(),
                ..default()
            });

            // circle_radius: max(width, height), that way it works even if change
            let circle_radius = (current_rect.width() / 2.0).max(current_rect.height() / 2.0);

            commands.spawn_bundle(MaterialMesh2dBundle {
                mesh: meshes.add(Circle::new(circle_radius).into()).into(),
                material: materials_color.add(rects_pinpad.circle_color.into()),
                transform: Transform::from_xyz(center_x, center_y, 0.0),
                ..default()
            });
        }
    }
}

/// Will draw the message texture at the given RectMessage
pub fn setup_message_texture(
    mut commands: Commands,
    mut images: ResMut<Assets<Image>>,
    rect_message: Res<crate::RectMessage>,
) {
    // Texture message = foreground
    commands.spawn_bundle(SpriteBundle {
        texture: images.add(uv_debug_texture(
            rect_message.circuit_dimension[0],
            rect_message.circuit_dimension[1],
        )),
        sprite: Sprite {
            custom_size: Some(Vec2::new(
                rect_message.rect.width(),
                rect_message.rect.height(),
            )),
            color: rect_message.text_color,
            ..default()
        },
        transform: Transform::from_xyz(
            // Sprite default to Anchor::Center which means x=0.0 will center it; and this also why "rect.height() / 2.0" and ""rect.width() / 2.0""
            rect_message.rect.center()[0],
            rect_message.rect.center()[1],
            1.0,
        ),
        ..default()
    });
}

/// add_startup_system: Init TextureUpdateCallbackMessage/TextureUpdateCallbackPinpad
/// using the mod "update_texture_utils"
// TODO ideally we would want to pass the function all the way from init_app, to completely
// decouple renderer and "circuit update"
pub fn setup_texture_update_systems(
    mut texture_update_callback_message: ResMut<TextureUpdateCallbackMessage>,
    mut texture_update_callback_pinpad: ResMut<TextureUpdateCallbackPinpad>,
) {
    texture_update_callback_message.callback = Some(Box::new(
        crate::update_texture_utils::update_texture_data_message,
    ));
    texture_update_callback_pinpad.callback = Some(Box::new(
        crate::update_texture_utils::update_texture_data_pinpad,
    ));
}

/// NOTE: it will REPLACE the default shader used by all SpriteSheetBundle/SpriteBundle/etc
/// This shader is allows to us to use alpha as a mask
/// - when the channel is set, it will draw the given color(set in Sprite init)
/// - when channel is 0.0, it will be full transparent[rbga 0,0,0,0]
/// -> ie we DO NOT want a background color; we want to "draw only the foreground"
///
/// ARCHIVE/ALTERNATIVE?
/// Based on https://github.com/bevyengine/bevy/blob/v0.7.0/examples/2d/sprite_manual.rs
/// but derive SpritePipeline instead of SpritePipeline
///
/// Allows to use a custom shader, with added uniform for colors
/// SpritePipeline only supports blending ONE color, but we want a behavior like
/// an ALPHA only texture(RED channel only in our case)
/// - if the channel is 1.0: draw the foreground color
/// - if the channel is 0.0: draw the background color
/// We do it this way b/c the "circuit outputs" are binary, so it simpler to have a
/// binary-like texture on the GPU side.
/// We could probably do it with a RGBA texture IFF the layout in memory is RRR...GGG...BBB...AAA
/// else it would means a sub-optimal buffer copy each frame instead of the direct
/// ~ memcopy("circuit outputs", "texture")
///
/// -> TODO? this fails b/c SpritePipeline* fields are private, which means we basically have to copy paste everything
/// in order to access them in "queue_colored_sprites"
//
// TODO can we find a way to override the shader only when needed
// see https://github.com/bevyengine/bevy/blob/main/crates/bevy_sprite/src/render/mod.rs for where SPRITE_SHADER_HANDLE is used
// cf colored_sprite_pipeline.rs
// NOTE: right now we use a DEFINE(let in wgsl) so both message and pinpad sprite WILL have the same text color...
pub fn setup_transparent_shader_for_sprites(
    mut shaders: ResMut<Assets<Shader>>,
    // mut pipeline_cache: ResMut<bevy::render::render_resource::PipelineCache>,
    // mut pipelines: ResMut<
    //     bevy::render::render_resource::SpecializedRenderPipelines<bevy::sprite::SpritePipeline>,
    // >,
    // mut sprite_pipeline: ResMut<bevy::sprite::SpritePipeline>,
    // msaa: Res<Msaa>,
    // theme: Res<crate::Theme>,
) {
    // cf https://github.com/bevyengine/bevy/blob/v0.7.0/crates/bevy_sprite/src/lib.rs
    // can we modify render/sprite.wgsl to do "if background color, set alpha = 0.0, else draw color"
    // TODO is there a way to override the shader for a specific Sprite?

    // let text_color_rgba = theme.text_color.as_rgba_f32();
    // let define_str = format!(
    //     "let BACKGROUND_COLOR: vec4<f32> = vec4<f32>({:.5}, {:.5}, {:.5}, {:.5});",
    //     text_color_rgba[0], text_color_rgba[1], text_color_rgba[2], text_color_rgba[3]
    // );

    let shader_str = format!("{}", include_str!("../data/transparent_sprite.wgsl"));

    let new_sprite_shader = Shader::from_wgsl(shader_str);
    shaders.set_untracked(bevy::sprite::SPRITE_SHADER_HANDLE, new_sprite_shader);

    // TODO?
    // pipeline_cache
    //     .get_render_pipeline_descriptor(bevy::render::render_resource::CachedRenderPipelineId(0))
    //     .fragment
    //     .unwrap()
    //     .shader_defs
    //     .push("other".to_string());
    //
    // cf /.../bevy_sprite-0.7.0/src/render/mod.rs around "let colored_pipeline"
    // let key = bevy::sprite::SpritePipelineKey::from_msaa_samples(msaa.samples);
    // let pipeline = pipelines.specialize(&mut pipeline_cache, &sprite_pipeline, key);
    // let colored_pipeline = pipelines.specialize(
    //     &mut pipeline_cache,
    //     &sprite_pipeline,
    //     key | bevy::sprite::SpritePipelineKey::COLORED,
    // );
}

// Creates a colorful test pattern
// https://github.com/bevyengine/bevy/blob/main/examples/3d/shapes.rs
fn uv_debug_texture(width: u32, height: u32) -> Image {
    // : Vec<u8> = vec!
    // : &[u8; 32] = &
    let palette: Vec<u8> = vec![
        255, 102, 159, 255, 255, 159, 102, 255, 236, 255, 102, 255, 121, 255, 102, 255, 102, 255,
        198, 255, 102, 198, 255, 255, 121, 102, 255, 255, 236, 102, 255, 255,
    ];

    // let mut texture_data = vec![0; (width * height * TEXTURE_PIXEL_NB_BYTES).try_into().unwrap()];
    // for y in 0..height {
    //     let offset = width * y * TEXTURE_PIXEL_NB_BYTES;
    //     texture_data[offset..(offset + width * TEXTURE_PIXEL_NB_BYTES)].copy_from_slice(&palette);
    //     palette.rotate_right(4);
    // }
    //
    // 4 because RGBA(or ARGB)
    let target_size = (width * height * TEXTURE_PIXEL_NB_BYTES) as usize;
    let mut texture_data = Vec::with_capacity(target_size);
    while texture_data.len() < target_size {
        let start = texture_data.len();
        // end:
        // - try to append the whole "palette"(32 bytes)
        // - but DO NOT exceed target_size
        let end = std::cmp::min(target_size, start + palette.len());
        texture_data.extend(&palette[0..(end - start)]);
    }
    assert!(texture_data.len() == target_size);

    Image::new_fill(
        Extent3d {
            width: width,
            height: height,
            depth_or_array_layers: 1,
        },
        wgpu::TextureDimension::D2,
        &texture_data,
        // wgpu::TextureFormat::bevy_default(),
        wgpu::TextureFormat::R8Unorm,
    )
```
### Validation Screen
High level screen in jetpack compose or swift UI to display the array of surface views generated directly by the GPU into the framebuffer with shaders.
This is just to illustrate that all the work is done by the lower level layers.

[TxPinpadScreen.kt](https://github.com/Interstellar-Network/wallet-app/blob/master/androidApp/src/main/java/gg/interstellar/wallet/android/ui/TxPinpadScreen.kt)
