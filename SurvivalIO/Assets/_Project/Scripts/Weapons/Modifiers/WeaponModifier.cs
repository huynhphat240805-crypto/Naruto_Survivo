using System;
using UnityEngine;

namespace SurvivalIO.Weapons
{
    /// <summary>
    /// Stat modifiers applied to weapons from passive items or global player buffs.
    /// </summary>
    [Serializable]
    public class WeaponModifier
    {
        public float DamageMultiplier = 1f;
        public float CooldownMultiplier = 1f;
        public float AreaMultiplier = 1f;
        public float SpeedMultiplier = 1f;
        public int AdditionalProjectiles = 0;
        public int AdditionalPierce = 0;

        public void Reset()
        {
            DamageMultiplier = 1f;
            CooldownMultiplier = 1f;
            AreaMultiplier = 1f;
            SpeedMultiplier = 1f;
            AdditionalProjectiles = 0;
            AdditionalPierce = 0;
        }
    }
}

