using System;
using System.Collections.Generic;

namespace SurvivalIO.SaveSystem
{
    [Serializable]
    public class PlayerProgressData
    {
        public int TotalCoins = 0;
        public int TotalMatchesPlayed = 0;
        public float LongestSurvivalTime = 0f;
        public int TotalKills = 0;
        public List<string> UnlockedCharacterIds = new List<string> { "naruto_default" };
        public List<string> UnlockedWeaponIds = new List<string> { "shuriken", "kunai" };
    }
}

