use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// Designation of object
#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq)]
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
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Object {
    // Identification
    //
    /// Unique ID assigned to track object
    pub object_id: Uuid,

    /// Designated alliance
    pub designation: ObjectDesignation,

    // Position
    //
    /// GPS Longitude
    pub longitude: f32,

    /// GPS Latitude
    pub latitude: f32,

    /// Measured in Feet
    pub altitude: f32,

    /// Measured in Degrees
    pub heading: f32,
}

impl Object {
    pub fn new(
        designation: ObjectDesignation,
        longitude: f32,
        latitude: f32,
        altitude: f32,
        heading: f32,
    ) -> Self {
        Self {
            object_id: Uuid::now_v7(),
            designation,
            longitude,
            latitude,
            altitude,
            heading,
        }
    }
}

/// Inherited type for all tasks
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Task {
    // Identification
    //
    /// Unique ID assigned to track task
    pub task_id: Uuid,

    // Assignment
    //
    /// ID of object assigned to carry out task
    ///
    /// References the object_id field of an Object.
    pub assigned_object_id: Uuid,

    /// ID of targeted object to carry out task on
    ///
    /// Optional - not all tasks have a specific target object.
    pub target_object_id: Option<Uuid>,
}

impl Task {
    pub fn new(assigned_object_id: Uuid, target_object_id: Option<Uuid>) -> Self {
        Self {
            task_id: Uuid::now_v7(),
            assigned_object_id,
            target_object_id,
        }
    }
}
