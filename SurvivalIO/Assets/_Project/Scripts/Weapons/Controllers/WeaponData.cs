using System;
using UnityEngine;

namespace SurvivalIO.Weapons
{
    public enum WeaponAttackType
    {
        NearestTarget,
        Directional,
        Orbital,
        AreaOfEffect
    }

    [Serializable]
    public class WeaponLevelStats
    {
        public int Level;
        public float Damage;
        public float Cooldown;
        public float ProjectileSpeed;
        public int ProjectileCount;
        public float AreaRadius;
        public float KnockbackForce;
        public int PierceCount;
        public string UpgradeDescription;
    }

    [Serializable]
    public class WeaponData
    {
        public string Id;
        public string Name;
        public string Description;
        public Sprite Icon;
        public WeaponAttackType AttackType;
        public GameObject ProjectilePrefab;
        public WeaponLevelStats[] Levels;
    }
}

