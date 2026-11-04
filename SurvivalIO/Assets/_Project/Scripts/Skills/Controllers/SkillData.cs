using System;
using UnityEngine;

namespace SurvivalIO.Skills
{
    public enum SkillType
    {
        PassiveStat,
        ActiveAbility,
        Aura
    }

    [Serializable]
    public class SkillLevelStats
    {
        public int Level;
        public float StatValue;
        public string Description;
    }

    [Serializable]
    public class SkillData
    {
        public string Id;
        public string Name;
        public string Description;
        public Sprite Icon;
        public SkillType Type;
        public SkillLevelStats[] Levels;
    }
}

