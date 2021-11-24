pub fn translate_key(key: &str, language: Language) -> String {
    let en_us: serde_json::Value = serde_json::from_str(include_str!("en_us.json")).unwrap();
    match language {
        Language::ENUS => {
            return String::from(en_us[key].as_str().unwrap());
        }
        _ => {
            todo!();
        }
    }
}

#[derive(Clone, Copy, Eq, PartialEq, Debug)]
pub enum Language {
    ENUS,
    ENCA,
    FR,
    SP
}
