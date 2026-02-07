use prost::Message;
use std::time::{SystemTime, UNIX_EPOCH};
use symphony_types::base::{Object, ObjectDesignation, ObjectList, ObjectStatus, ObjectType};
use ulid::Ulid;

#[tauri::command]
fn get_objects() -> Result<Vec<u8>, String> {
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    let objects = vec![
        Object {
            object_id: Ulid::new().to_bytes().to_vec(),
            designation: ObjectDesignation::Friendly as i32,
            r#type: ObjectType::FixedWing as i32,
            longitude: -122.4194,
            latitude: 37.7749,
            altitude: 1000.0,
            heading: 45.0,
            speed: Some(350.0),
            vertical_speed: Some(0.0),
            status: ObjectStatus::Active as i32,
            fuel_percentage: Some(85.0),
            ammo_percentage: Some(100.0),
            callsign: Some("Eagle-1".into()),
            model: Some("F-16C".into()),
            unit: Some("1st Fighter Wing".into()),
            created_at: now,
            updated_at: now,
            current_task_id: None,
            home_base: None,
        },
        Object {
            object_id: Ulid::new().to_bytes().to_vec(),
            designation: ObjectDesignation::Friendly as i32,
            r#type: ObjectType::FixedWing as i32,
            longitude: -122.4194,
            latitude: 37.7749,
            altitude: 1000.0,
            heading: 45.0,
            speed: Some(350.0),
            vertical_speed: Some(0.0),
            status: ObjectStatus::Active as i32,
            fuel_percentage: Some(85.0),
            ammo_percentage: Some(100.0),
            callsign: Some("Eagle-1".into()),
            model: Some("F-16C".into()),
            unit: Some("1st Fighter Wing".into()),
            created_at: now,
            updated_at: now,
            current_task_id: None,
            home_base: None,
        },
        Object {
            object_id: Ulid::new().to_bytes().to_vec(),
            designation: ObjectDesignation::Friendly as i32,
            r#type: ObjectType::FixedWing as i32,
            longitude: -122.4194,
            latitude: 37.7749,
            altitude: 1000.0,
            heading: 45.0,
            speed: Some(350.0),
            vertical_speed: Some(0.0),
            status: ObjectStatus::Active as i32,
            fuel_percentage: Some(85.0),
            ammo_percentage: Some(100.0),
            callsign: Some("Eagle-1".into()),
            model: Some("F-16C".into()),
            unit: Some("1st Fighter Wing".into()),
            created_at: now,
            updated_at: now,
            current_task_id: None,
            home_base: None,
        },
        Object {
            object_id: Ulid::new().to_bytes().to_vec(),
            designation: ObjectDesignation::Hostile as i32,
            r#type: ObjectType::Uav as i32,
            longitude: -118.2437,
            latitude: 34.0522,
            altitude: 2000.0,
            heading: 180.0,
            speed: Some(120.0),
            vertical_speed: Some(-100.0),
            status: ObjectStatus::Engaged as i32,
            fuel_percentage: Some(40.0),
            ammo_percentage: Some(20.0),
            callsign: Some("Ghost-01".into()),
            model: Some("Shahed-136".into()),
            unit: None,
            created_at: now,
            updated_at: now,
            current_task_id: None,
            home_base: None,
        },
    ];

    let object_list = ObjectList { objects };

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
