/// Designation of object
pub enum ObjectDesignation {
    UNKNOWN,
    HOSTILE,
    CIVILIAN,
    ALLY,
    FRIENDLY,
}

/// Inherited type for all objects.
///
/// This includes everything from aircrafts, ground units, to any point in space that can be tracked
pub struct Object {
    /*
     * Position
     */
    /// GPS Longitude
    longitude: f32,
    /// GPS Latitude
    latitude: f32,
    /// Measued in Feet
    altitude: f32,
    /// Measured in Degrees
    heading: f32,

    /*
     * Identification
     */
    /// Unique ID assigned to track object
    object_id: u64,
    /// Designated alliance
    designation: ObjectDesignation,
}

/// Inherited type for all tasks
pub struct Task<'a> {
    /*
     * Identification
     */
    /// Unique ID assigned to track task
    task_id: u64,

    /*
     * Assignment
     */
    /// Object assigned to carry out task
    assigned_object: &'a Object,
    /// Targetted object to carry out task on
    target_object: Option<&'a Object>,
}
