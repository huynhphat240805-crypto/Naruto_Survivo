using UnityEngine;

namespace SurvivalIO.Combat
{
    /// <summary>
    /// Calculates critical strike procs and scaled damage output.
    /// </summary>
    public static class CriticalHitCalculator
    {
        public static (float damage, bool isCritical) Evaluate(float baseDamage, float critRate, float critMultiplier)
        {
            float roll = Random.value;
            bool isCrit = roll < Mathf.Clamp01(critRate);
            float finalDamage = isCrit ? baseDamage * Mathf.Max(1f, critMultiplier) : baseDamage;
            return (finalDamage, isCrit);
        }
    }
}

