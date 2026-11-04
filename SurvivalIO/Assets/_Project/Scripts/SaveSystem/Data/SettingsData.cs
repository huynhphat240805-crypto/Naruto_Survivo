using System;

namespace SurvivalIO.SaveSystem
{
    [Serializable]
    public class SettingsData
    {
        public float MasterVolume = 1f;
        public float MusicVolume = 0.8f;
        public float SFXVolume = 1f;
        public bool VibrationEnabled = true;
        public bool ShowDamageNumbers = true;
    }
}

