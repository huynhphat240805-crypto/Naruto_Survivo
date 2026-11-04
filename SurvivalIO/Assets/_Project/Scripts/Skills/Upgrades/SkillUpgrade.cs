using System;
using UnityEngine;

namespace SurvivalIO.Skills
{
    [Serializable]
    public class SkillUpgrade
    {
        public string SkillId;
        public int TargetLevel;
        public float StatIncrease;
        public string Description;
    }
}

