use serde::{Deserialize, Serialize};
use ulid::Ulid;

// ============================================================================
// Core Types
// ============================================================================

/// Designation/alliance of an object
#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[repr(u8)]
pub enum ObjectDesignation {
    UNKNOWN = 0,
    HOSTILE = 1,
    CIVILIAN = 2,
    ALLY = 3,
    FRIENDLY = 4,
}

impl Default for ObjectDesignation {
    fn default() -> Self {
        Self::UNKNOWN
    }
}

/// Base object type for all trackable entities
///
/// Represents any entity in the simulation: aircraft, ground units,
/// missiles, waypoints, etc.
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Object {
    /// Unique identifier (ULID format)
    /// Serialized as u128 for efficiency
    #[serde(with = "ulid_as_u128")]
    pub object_id: Ulid,

    /// Alliance/designation
    pub designation: ObjectDesignation,

    /// GPS Longitude (decimal degrees)
    pub longitude: f32,

    /// GPS Latitude (decimal degrees)
    pub latitude: f32,

    /// Altitude (feet MSL)
    pub altitude: f32,

    /// Heading (degrees, 0-360, true north)
    pub heading: f32,
}

impl Object {
    /// Create new object with generated ID
    pub fn new(
        designation: ObjectDesignation,
        longitude: f32,
        latitude: f32,
        altitude: f32,
        heading: f32,
    ) -> Self {
        Self {
            object_id: Ulid::new(),
            designation,
            longitude,
            latitude,
            altitude,
            heading,
        }
    }

    /// Create object with specific ID (for deserialization/testing)
    pub fn with_id(
        object_id: Ulid,
        designation: ObjectDesignation,
        longitude: f32,
        latitude: f32,
        altitude: f32,
        heading: f32,
    ) -> Self {
        Self {
            object_id,
            designation,
            longitude,
            latitude,
            altitude,
            heading,
        }
    }

    /// Bulk creation of objects (efficient batch allocation)
    pub fn new_batch(count: usize, designation: ObjectDesignation) -> Vec<Self> {
        (0..count)
            .map(|_| Self::new(designation, 0.0, 0.0, 0.0, 0.0))
            .collect()
    }
}

/// Task assigned to an object
///
/// Represents missions, orders, or objectives assigned to simulation entities.
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Task {
    /// Unique task identifier
    #[serde(with = "ulid_as_u128")]
    pub task_id: Ulid,

    /// ID of object assigned to execute this task
    #[serde(with = "ulid_as_u128")]
    pub assigned_object_id: Ulid,

    /// Optional target object for this task
    #[serde(with = "option_ulid_as_u128")]
    pub target_object_id: Option<Ulid>,
}

impl Task {
    /// Create new task with generated ID
    pub fn new(assigned_object_id: Ulid, target_object_id: Option<Ulid>) -> Self {
        Self {
            task_id: Ulid::new(),
            assigned_object_id,
            target_object_id,
        }
    }

    /// Create task with specific ID (for deserialization/testing)
    pub fn with_id(
        task_id: Ulid,
        assigned_object_id: Ulid,
        target_object_id: Option<Ulid>,
    ) -> Self {
        Self {
            task_id,
            assigned_object_id,
            target_object_id,
        }
    }
}

// ============================================================================
// Serialization Helpers
// ============================================================================

/// Serialize ULID as u128 instead of string (50% smaller, much faster)
mod ulid_as_u128 {
    use serde::{Deserialize, Deserializer, Serializer};
    use ulid::Ulid;

    pub fn serialize<S>(ulid: &Ulid, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_u128(ulid.0)
    }

    pub fn deserialize<'de, D>(deserializer: D) -> Result<Ulid, D::Error>
    where
        D: Deserializer<'de>,
    {
        let value = u128::deserialize(deserializer)?;
        Ok(Ulid(value))
    }
}

/// Serialize Option<ULID> as Option<u128>
mod option_ulid_as_u128 {
    use serde::{Deserialize, Deserializer, Serializer};
    use ulid::Ulid;

    pub fn serialize<S>(value: &Option<Ulid>, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        match value {
            Some(ulid) => serializer.serialize_some(&ulid.0),
            None => serializer.serialize_none(),
        }
    }

    pub fn deserialize<'de, D>(deserializer: D) -> Result<Option<Ulid>, D::Error>
    where
        D: Deserializer<'de>,
    {
        Option::<u128>::deserialize(deserializer).map(|opt| opt.map(Ulid))
    }
}

// ============================================================================
// Utility Functions
// ============================================================================

impl Object {
    /// Update object position
    pub fn update_position(&mut self, longitude: f32, latitude: f32, altitude: f32) {
        self.longitude = longitude;
        self.latitude = latitude;
        self.altitude = altitude;
    }

    /// Update object heading
    pub fn update_heading(&mut self, heading: f32) {
        self.heading = heading.rem_euclid(360.0);
    }

    /// Check if object is hostile
    pub fn is_hostile(&self) -> bool {
        self.designation == ObjectDesignation::HOSTILE
    }

    /// Check if object is friendly
    pub fn is_friendly(&self) -> bool {
        matches!(
            self.designation,
            ObjectDesignation::FRIENDLY | ObjectDesignation::ALLY
        )
    }
}

impl Task {
    /// Check if task has a target
    pub fn has_target(&self) -> bool {
        self.target_object_id.is_some()
    }

    /// Get target ID if present
    pub fn get_target(&self) -> Option<Ulid> {
        self.target_object_id
    }
}
