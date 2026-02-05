use rkyv::{Archive, Deserialize as RkyvDeserialize, Serialize as RkyvSerialize};
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

/// Designation of object
///
/// This enum is zero-copy serializable with rkyv and serializes to a TypeScript
/// union type via typeshare.
#[typeshare]
#[derive(
    Archive, RkyvSerialize, RkyvDeserialize, Serialize, Deserialize, Debug, Clone, Copy, PartialEq,
)]
#[rkyv(compare(PartialEq), derive(Debug))]
pub enum ObjectDesignation {
    UNKNOWN,
    HOSTILE,
    CIVILIAN,
    ALLY,
    FRIENDLY,
}

/// Inherited type for all objects.
///
/// This includes everything from aircrafts, ground units, to any point in space
/// that can be tracked.
///
/// ## Serialization
/// - Uses rkyv for efficient zero-copy Rust-to-Rust serialization
/// - Uses serde/typeshare for JSON serialization to TypeScript
/// - ULIDs are stored as u128 internally for rkyv efficiency, but serialize
///   to strings in JSON for TypeScript compatibility
#[typeshare]
#[derive(Archive, RkyvSerialize, RkyvDeserialize, Serialize, Deserialize, Debug, Clone)]
#[rkyv(compare(PartialEq), derive(Debug))]
pub struct Object {
    // Identification
    /// Unique ID assigned to track object
    ///
    /// Stored as u128 for zero-copy rkyv serialization, but serializes to/from
    /// ULID string format in JSON for TypeScript.
    #[serde(
        serialize_with = "serialize_ulid",
        deserialize_with = "deserialize_ulid"
    )]
    object_id: u128,

    /// Designated alliance
    designation: ObjectDesignation,

    // Position
    /// GPS Longitude
    longitude: f32,

    /// GPS Latitude
    latitude: f32,

    /// Measured in Feet
    altitude: f32,

    /// Measured in Degrees
    heading: f32,
}

impl Object {
    /// Create a new object with a generated ULID
    pub fn new(
        designation: ObjectDesignation,
        longitude: f32,
        latitude: f32,
        altitude: f32,
        heading: f32,
    ) -> Self {
        Self {
            object_id: ulid::Ulid::new().into(),
            designation,
            longitude,
            latitude,
            altitude,
            heading,
        }
    }

    /// Get the object ID as a ULID
    pub fn object_id(&self) -> ulid::Ulid {
        ulid::Ulid::from(self.object_id)
    }

    /// Set the object ID from a ULID
    pub fn set_object_id(&mut self, ulid: ulid::Ulid) {
        self.object_id = ulid.into();
    }
}

/// Inherited type for all tasks
///
/// ## Serialization
/// - Uses rkyv for efficient zero-copy Rust-to-Rust serialization
/// - Uses serde/typeshare for JSON serialization to TypeScript
/// - ULIDs are stored as u128 internally for rkyv efficiency, but serialize
///   to strings in JSON for TypeScript compatibility
#[typeshare]
#[derive(Archive, RkyvSerialize, RkyvDeserialize, Serialize, Deserialize, Debug, Clone)]
#[rkyv(compare(PartialEq), derive(Debug))]
pub struct Task {
    // Identification
    /// Unique ID assigned to track task
    ///
    /// Stored as u128 for zero-copy rkyv serialization, but serializes to/from
    /// ULID string format in JSON for TypeScript.
    #[serde(
        serialize_with = "serialize_ulid",
        deserialize_with = "deserialize_ulid"
    )]
    task_id: u128,

    // Assignment
    /// ID of object assigned to carry out task
    ///
    /// References the object_id field of an Object.
    #[serde(
        serialize_with = "serialize_ulid",
        deserialize_with = "deserialize_ulid"
    )]
    assigned_object_id: u128,

    /// ID of targeted object to carry out task on
    ///
    /// Optional - not all tasks have a specific target object.
    #[serde(
        serialize_with = "serialize_option_ulid",
        deserialize_with = "deserialize_option_ulid"
    )]
    target_object_id: Option<u128>,
}

impl Task {
    /// Create a new task with a generated ULID
    pub fn new(assigned_object_id: ulid::Ulid, target_object_id: Option<ulid::Ulid>) -> Self {
        Self {
            task_id: ulid::Ulid::new().into(),
            assigned_object_id: assigned_object_id.into(),
            target_object_id: target_object_id.map(|id| id.into()),
        }
    }

    /// Get the task ID as a ULID
    pub fn task_id(&self) -> ulid::Ulid {
        ulid::Ulid::from(self.task_id)
    }

    /// Get the assigned object ID as a ULID
    pub fn assigned_object_id(&self) -> ulid::Ulid {
        ulid::Ulid::from(self.assigned_object_id)
    }

    /// Get the target object ID as a ULID, if present
    pub fn target_object_id(&self) -> Option<ulid::Ulid> {
        self.target_object_id.map(ulid::Ulid::from)
    }
}

// Serde helper functions for ULID serialization
//
// These functions handle conversion between u128 (used internally for rkyv
// efficiency) and ULID strings (used in JSON for TypeScript compatibility).

/// Serialize a ULID (stored as u128) to a string for JSON
fn serialize_ulid<S>(value: &u128, serializer: S) -> Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    let ulid = ulid::Ulid::from(*value);
    serializer.serialize_str(&ulid.to_string())
}

/// Deserialize a ULID string from JSON to u128
fn deserialize_ulid<'de, D>(deserializer: D) -> Result<u128, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let s = String::deserialize(deserializer)?;
    let ulid: ulid::Ulid = s.parse().map_err(serde::de::Error::custom)?;
    Ok(ulid.into())
}

/// Serialize an optional ULID (stored as Option<u128>) to an optional string for JSON
fn serialize_option_ulid<S>(value: &Option<u128>, serializer: S) -> Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    match value {
        Some(v) => {
            let ulid = ulid::Ulid::from(*v);
            serializer.serialize_some(&ulid.to_string())
        }
        None => serializer.serialize_none(),
    }
}

/// Deserialize an optional ULID string from JSON to Option<u128>
fn deserialize_option_ulid<'de, D>(deserializer: D) -> Result<Option<u128>, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let opt: Option<String> = Option::deserialize(deserializer)?;
    opt.map(|s| {
        let ulid: ulid::Ulid = s.parse().map_err(serde::de::Error::custom)?;
        Ok(ulid.into())
    })
    .transpose()
}
