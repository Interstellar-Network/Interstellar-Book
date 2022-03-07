# Garbled Cicuit Factory APIs

Description of the APIs called from substrate modules to manage circuits production. Those APis are pretty generic and can be adapted to different types of circuit production.

> [IPFS](https://ipfs.io/) is used by the external GCF service for the storage of both configuration files and produced garbled circuits. Although, for now only ipfs hash/cid are used in the GCF substrate modules. At a later stage we could include substrate ipfs solutions like [OCW ipfs](https://rs-ipfs.github.io/offchain-ipfs-manual/) to deal with other use cases e.g Secure Multi Party Computation. In that case pre-computed Garbled Circuit could be loaded from ipfs to be evaluated within a pallet module to manage an SMPC protocol with others parties.

## Flowchart and  substrate GCF pallets

![FC GCF pallets](./fig/GCF-Substrate.svg)


## GCF APIs
This is a list of the APIs used in substrate framework to pilot the generation of the Garbled Circuits required  by the Interstellar infrastructure.

### Launh circuit production from OCW on GCF (external service)

`generate_circuit`: [api_circuits/src/circuit_routes.rs:57](https://github.com/Interstellar-Network/api_circuits/blob/main/src/circuits_routes.rs#L57)

`Request`   : start the circuit(s) generation with hash/cid  of master files + parameter related to circuit production e.g size/resolution of display circuits

`Response`  : get hash/cid of the circuit on ipfs

`Status`    : circuit production state


circuit_route.rs
```rust,editable
#[tonic::async_trait]
impl SkcdApi for SkcdApiServerImpl {
    async fn generate_skcd_display(
        &self,
        request: Request<SkcdDisplayRequest>,
    ) -> Result<Response<SkcdDisplayReply>, Status> {
        println!("Got a request from {:?}", request.remote_addr());
        let width = request.get_ref().width;
        let height = request.get_ref().height;

        // TODO class member/Trait for "lib_circuits_wrapper::ffi::new_circuit_gen_wrapper()"
        // TODO cleanup; remove clone(), etc
        let lib_circuits_wrapper = tokio::task::spawn_blocking(move || {
            let tmp_dir = Builder::new().prefix("example").tempdir().unwrap();

            let file_path = tmp_dir.path().join("output.skcd.pb.bin");
            let mut tmp_file = File::create(file_path.clone()).unwrap();

            let wrapper = lib_circuits_wrapper::ffi::new_circuit_gen_wrapper();

            // TODO make the C++ API return a buffer?
            wrapper.GenerateDisplaySkcd(file_path.as_os_str().to_str().unwrap(), width, height);

            //`Result::unwrap()` on an `Err` value: Os { code: 9, kind: Uncategorized, message: "Bad file descriptor" }', src/circuits_routes.rs:81:47
            // let mut buf = String::new();
            // tmp_file.read_to_string(&mut buf).unwrap();
            // buf.clone()

            // Error { kind: InvalidData, message: "stream did not contain valid UTF-8" }', src/circuits_routes.rs:86:52
            // let contents =
            //     std::fs::read_to_string(file_path).expect("Something went wrong reading the file");
            let contents = std::fs::read(file_path).expect("Something went wrong reading the file");

            contents
        })
        .await
        .unwrap();

        let data = Cursor::new(lib_circuits_wrapper);

        // TODO error handling, or at least logging
        let ipfs_result = self.ipfs_client().add(data).await.unwrap();

        let reply = SkcdDisplayReply {
            hash: format!("{}", ipfs_result.hash),
        };

        Ok(Response::new(reply))
    }
}
```