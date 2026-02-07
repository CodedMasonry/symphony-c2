use prost::Message; // Required for .encode()
use symphony_types::base::{Object, ObjectDesignation, ObjectList};
use ulid::Ulid;

#[tauri::command]
fn get_objects() -> Result<Vec<u8>, String> {
    // Generate some sample objects with ULIDs
    let objects = vec![
        Object {
            object_id: Ulid::new().to_bytes().to_vec(),
            designation: ObjectDesignation::Friendly as i32,
            longitude: -122.4194,
            latitude: 37.7749,
            altitude: 1000.0,
            heading: 45.0,
        },
        Object {
            object_id: Ulid::new().to_bytes().to_vec(),
            designation: ObjectDesignation::Hostile as i32,
            longitude: -118.2437,
            latitude: 34.0522,
            altitude: 2000.0,
            heading: 180.0,
        },
        Object {
            object_id: Ulid::new().to_bytes().to_vec(),
            designation: ObjectDesignation::Civilian as i32,
            longitude: -73.9352,
            latitude: 40.7306,
            altitude: 500.0,
            heading: 270.0,
        },
        Object {
            object_id: Ulid::new().to_bytes().to_vec(),
            designation: ObjectDesignation::Ally as i32,
            longitude: -0.1276,
            latitude: 51.5074,
            altitude: 1500.0,
            heading: 90.0,
        },
    ];

    // Wrap in ObjectList
    let object_list = ObjectList { objects };

    // Encode to protobuf bytes
    let mut buf = Vec::new();
    object_list.encode(&mut buf).map_err(|e| e.to_string())?;

    Ok(buf)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_objects])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
