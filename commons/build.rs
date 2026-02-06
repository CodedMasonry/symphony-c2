fn main() -> std::io::Result<()> {
    let mut config = prost_build::Config::new();
    // This tells prost to output to a specific folder instead of deep in /target/
    config.out_dir("generated");
    config.compile_protos(&["./proto/simulation.proto"], &["./proto/"])?;
    Ok(())
}
