use prost::Message; // Required for .encode()
use symphony_commons::simulation::Object;
use symphony_commons::UlidSupport;
use tauri::ipc::Response;

#[tauri::command]
fn get_object_binary() -> Response {
    // 1. Create your Protobuf-generated struct
    let mut obj = Object::default();
    obj.set_ulid(ulid::Ulid::new());
    obj.latitude = 42.0;
    obj.longitude = -71.0;

    // 2. Encode the struct into a byte vector (Vec<u8>)
    let mut buf = Vec::new();
    obj.encode(&mut buf).expect("Failed to encode Protobuf");

    // 3. Return a specialized IPC Response to keep it binary
    Response::new(buf)
}
