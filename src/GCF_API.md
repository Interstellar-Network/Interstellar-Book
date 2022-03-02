# Garbled Cicuit Factory API


## Flowchart and  substrate GCF pallets

![FC GCF pallets](./fig/GCF-Substrate.svg)





## APIs
This is a list of APIs used in substrate framework to pilot the generation of the Garbled Circuits needed by the Interstellar infrsstructure.





TEST/CHECK rust code display with ace theme
```rust
use tonic::transport::Server;

mod circuits_routes;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // TODO tracing
    // tracing_subscriber::fmt::init();

    // TODO configurable port
    let addr = "127.0.0.1:3000".parse().unwrap();

    let circuits_api = circuits_routes::CircuitsServerImpl::default();
    let circuits_api =
        circuits_routes::interstellarpbapicircuits::circuits_api_server::CircuitsApiServer::new(
            circuits_api,
        );
    // let greeter = InterstellarCircuitsApiClient::new(greeter);
    let circuits_api = tonic_web::config()
        .allow_origins(vec!["127.0.0.1"])
        .enable(circuits_api);

    println!("GreeterServer listening on {}", addr);

    Server::builder()
        .accept_http1(true)
        .add_service(circuits_api)
        .serve(addr)
        .await?;

    Ok(())
}
```