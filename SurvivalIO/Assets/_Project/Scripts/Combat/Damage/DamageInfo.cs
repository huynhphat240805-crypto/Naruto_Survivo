using System;
using UnityEngine;

namespace SurvivalIO.Combat
{
    [Serializable]
    public struct DamageInfo
    {
        public float Amount;
        public bool IsCritical;
        public Vector2 Direction;
        public float KnockbackForce;
        public GameObject Source;
        public StatusEffectType StatusEffect;

        public DamageInfo(float amount, Vector2 direction, float knockbackForce = 0f, bool isCritical = false, GameObject source = null, StatusEffectType status = StatusEffectType.None)
        {
            Amount = amount;
            Direction = direction;
            KnockbackForce = knockbackForce;
            IsCritical = isCritical;
            Source = source;
            StatusEffect = status;
        }
    }
}

