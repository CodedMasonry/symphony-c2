use prost::Message;
use rand::{seq::IndexedRandom, RngExt};
use std::time::{SystemTime, UNIX_EPOCH};
use ulid::Ulid;

// Assuming these are in your crate's modules
use symphony_types::base::{
    object, AirEntity, Context, Echelon, LandEquipmentEntity, Object, ObjectList, ObjectStatus,
    OperationalCondition, SeaEntity, StandardIdentity, SymbolSet,
};

struct EntityProfile {
    model: &'static str,
    unit: &'static str,
    symbol_set: SymbolSet,
    entity_variant: object::Entity, // Pre-constructed oneof variant
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

    // Define Military Profiles based on your generated Enums
    let profiles = [
        EntityProfile {
            model: "F-35C Lightning II",
            unit: "VFA-147",
            symbol_set: SymbolSet::Air,
            entity_variant: object::Entity::AirEntity(AirEntity::MilitaryAircraft as i32),
            min_alt: 15000.0,
            max_alt: 40000.0,
            min_speed: 450.0,
            max_speed: 700.0,
        },
        EntityProfile {
            model: "MQ-9 Reaper",
            unit: "432nd WG",
            symbol_set: SymbolSet::Air,
            entity_variant: object::Entity::AirEntity(AirEntity::UavFixedWing as i32),
            min_alt: 10000.0,
            max_alt: 25000.0,
            min_speed: 120.0,
            max_speed: 180.0,
        },
        EntityProfile {
            model: "M1A2 Abrams",
            unit: "1st Armored",
            symbol_set: SymbolSet::LandEquipment,
            entity_variant: object::Entity::LandEquipmentEntity(LandEquipmentEntity::Tank as i32),
            min_alt: 0.0,
            max_alt: 0.0,
            min_speed: 5.0,
            max_speed: 40.0,
        },
        EntityProfile {
            model: "Arleigh Burke-class",
            unit: "DESRON 2",
            symbol_set: SymbolSet::SeaSurface,
            entity_variant: object::Entity::SeaEntity(SeaEntity::Destroyer as i32),
            min_alt: 0.0,
            max_alt: 0.0,
            min_speed: 15.0,
            max_speed: 32.0,
        },
    ];

    let callsigns = ["Viper", "Ghost", "Stinger", "Atlas", "Odin"];
    let num_objects = rng.random_range(10..20);
    let mut objects = Vec::new();

    for _ in 0..num_objects {
        let profile = profiles.choose(&mut rng).unwrap();

        // Randomize coordinates (Centered around a generic ops area)
        let lat = rng.random_range(34.0..36.0);
        let lon = rng.random_range(-116.0..-114.0);

        // Map identity (80% Friend, 20% Hostile)
        let identity = if rng.random_bool(0.8) {
            StandardIdentity::Friend
        } else {
            StandardIdentity::Hostile
        };

        let obj = Object {
            object_id: Ulid::new().to_bytes().to_vec(),
            standard_identity: identity as i32,
            symbol_set: profile.symbol_set as i32,
            status: ObjectStatus::Present as i32,
            context: Context::Simulation as i32,

            // Optional Enums - wrapped in Some() as i32
            echelon: Some(Echelon::Battalion as i32),
            operational_condition: Some(OperationalCondition::FullyCapable as i32),

            longitude: lon,
            latitude: lat,
            altitude: rng.random_range(profile.min_alt..=profile.max_alt),
            heading: rng.random_range(0.0..360.0),

            // Optional Kinematics
            speed: Some(rng.random_range(profile.min_speed..=profile.max_speed)),
            vertical_speed: if profile.symbol_set == SymbolSet::Air {
                Some(rng.random_range(-200.0..200.0))
            } else {
                None
            },

            // Metadata - Option<String>
            callsign: Some(format!(
                "{}-{}",
                callsigns.choose(&mut rng).unwrap(),
                rng.random_range(1..9)
            )),
            model: Some(profile.model.to_string()),
            unit: Some(profile.unit.to_string()),
            unique_designation: Some(Ulid::new().to_string()),

            // Timestamps
            created_at: now,
            updated_at: now,

            // Combat State
            is_engaged: rng.random_bool(0.1),
            threat_level: Some(rng.random_range(1..5)),

            // Oneof field
            entity: Some(profile.entity_variant),

            ..Default::default() // Handles remaining Option fields as None
        };

        objects.push(obj);
    }

    let list = ObjectList { objects };
    let mut buf = Vec::new();
    list.encode(&mut buf).map_err(|e| e.to_string())?;

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
