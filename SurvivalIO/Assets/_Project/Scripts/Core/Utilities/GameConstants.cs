namespace SurvivalIO.Core
{
    /// <summary>
    /// Global game constants and layer/tag definitions.
    /// </summary>
    public static class GameConstants
    {
        // Scene Names
        public const string SCENE_BOOTSTRAP = "00_Bootstrap";
        public const string SCENE_MAIN_MENU = "01_MainMenu";
        public const string SCENE_CHARACTER_SELECT = "02_CharacterSelect";
        public const string SCENE_GAMEPLAY = "03_Gameplay";
        public const string SCENE_RESULT = "04_Result";
        public const string SCENE_SETTINGS = "05_Settings";

        // Tags
        public const string TAG_PLAYER = "Player";
        public const string TAG_ENEMY = "Enemy";
        public const string TAG_BOSS = "Boss";
        public const string TAG_PICKUP = "Pickup";
        public const string TAG_PROJECTILE = "Projectile";

        // Layers
        public const string LAYER_PLAYER = "Player";
        public const string LAYER_ENEMY = "Enemy";
        public const string LAYER_PROJECTILE = "Projectile";
        public const string LAYER_COLLECTABLE = "Collectable";

        // Game Settings
        public const int DEFAULT_TARGET_FRAME_RATE = 60;
        public const float INVINCIBILITY_FLASH_INTERVAL = 0.1f;
        public const int MAX_ACTIVE_WEAPONS = 6;
        public const int MAX_PASSIVE_SKILLS = 6;
    }
}

