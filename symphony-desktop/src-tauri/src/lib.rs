use prost::Message;
use rand::{seq::IndexedRandom, RngExt};
use std::time::{SystemTime, UNIX_EPOCH};
use symphony_types::base::{Object, ObjectDesignation, ObjectList, ObjectStatus, ObjectType};
use ulid::Ulid;

struct EntityProfile {
    model: &'static str,
    unit: &'static str,
    obj_type: ObjectType,
    min_alt: f32,
    max_alt: f32,
    min_speed: f32,
    max_speed: f32,
}

#[tauri::command]
fn get_objects() -> Result<Vec<u8>, String> {
    let mut rng = rand::rng();
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    // Define realistic military profiles
    let profiles = [
        EntityProfile {
            model: "F-35C Lightning II",
            unit: "VFA-147",
            obj_type: ObjectType::FixedWing,
            min_alt: 15000.0,
            max_alt: 40000.0,
            min_speed: 450.0,
            max_speed: 700.0,
        },
        EntityProfile {
            model: "P-8A Poseidon",
            unit: "VP-16",
            obj_type: ObjectType::FixedWing,
            min_alt: 5000.0,
            max_alt: 15000.0,
            min_speed: 250.0,
            max_speed: 350.0,
        },
        EntityProfile {
            model: "Arleigh Burke-class",
            unit: "DESRON 2",
            obj_type: ObjectType::Naval,
            min_alt: 0.0,
            max_alt: 0.0,
            min_speed: 15.0,
            max_speed: 32.0,
        },
        EntityProfile {
            model: "MQ-9 Reaper",
            unit: "432nd WG",
            obj_type: ObjectType::Uav,
            min_alt: 10000.0,
            max_alt: 25000.0,
            min_speed: 120.0,
            max_speed: 180.0,
        },
        EntityProfile {
            model: "MH-60R Seahawk",
            unit: "HSM-70",
            obj_type: ObjectType::RotaryWing,
            min_alt: 500.0,
            max_alt: 3000.0,
            min_speed: 80.0,
            max_speed: 140.0,
        },
        EntityProfile {
            model: "Container Ship",
            unit: "Maersk Line",
            obj_type: ObjectType::Naval,
            min_alt: 0.0,
            max_alt: 0.0,
            min_speed: 12.0,
            max_speed: 20.0,
        },
    ];

    let callsigns = ["BOLT", "REAPER", "TITAN", "GHOST", "MAKO", "SWORD", "VODKA"];

    let num_objects = rng.random_range(8..18);
    let mut objects = Vec::new();

    for _ in 0..num_objects {
        let profile = profiles.choose(&mut rng).unwrap();

        // Randomize East Coast coordinates
        let lat = rng.random_range(30.0..42.0);
        let lon = rng.random_range(-78.0..-68.0);

        // Determine designation based on unit/model (Simplified logic)
        let designation = if profile.unit.contains("Maersk") {
            ObjectDesignation::Civilian
        } else if rng.random_bool(0.15) {
            ObjectDesignation::Hostile // 15% chance of being a "bad guy"
        } else {
            ObjectDesignation::Friendly
        };

        let callsign = format!(
            "{}-{}",
            callsigns.choose(&mut rng).unwrap(),
            rng.random_range(10..99)
        );

        objects.push(Object {
            object_id: Ulid::new().to_bytes().to_vec(),
            designation: designation as i32,
            object_type: profile.obj_type as i32,
            longitude: lon,
            latitude: lat,
            altitude: rng.random_range(profile.min_alt..=profile.max_alt),
            heading: rng.random_range(0.0..360.0),
            speed: Some(rng.random_range(profile.min_speed..=profile.max_speed)),
            vertical_speed: Some(if profile.obj_type == ObjectType::Naval {
                0.0
            } else {
                rng.random_range(-500.0..500.0)
            }),
            status: ObjectStatus::Active as i32,
            fuel_percentage: Some(rng.random_range(30.0..100.0)),
            ammo_percentage: Some(100.0),
            callsign: Some(callsign),
            model: Some(profile.model.into()),
            unit: Some(profile.unit.into()),
            created_at: now,
            updated_at: now,
            current_task_id: None,
            home_base: None,
        });
    }

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
