using System;

namespace SurvivalIO.SaveSystem
{
    [Serializable]
    public class SaveData
    {
        public int SaveVersion = 1;
        public long Timestamp;
        public PlayerProgressData Progress = new PlayerProgressData();
        public SettingsData Settings = new SettingsData();
    }
}

