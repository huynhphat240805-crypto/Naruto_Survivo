using UnityEngine;

namespace SurvivalIO.Combat
{
    /// <summary>
    /// Computes mitigation, armor reduction, and net damage value.
    /// </summary>
    public static class DamageCalculator
    {
        public static float CalculateMitigatedDamage(float incomingDamage, float armor)
        {
            if (incomingDamage <= 0f) return 0f;
            // Standard diminishing returns armor reduction formula: dmg * 100 / (100 + armor)
            if (armor >= 0f)
            {
                float reduction = 100f / (100f + armor);
                return Mathf.Max(1f, incomingDamage * reduction);
            }
            else
            {
                // Negative armor increases damage taken
                float amplifier = 2f - (100f / (100f - armor));
                return incomingDamage * amplifier;
            }
        }
    }
}

