using UnityEngine;

namespace SurvivalIO.Core
{
    /// <summary>
    /// Contract for entities that can take damage.
    /// </summary>
    public interface IDamageable
    {
        bool IsAlive { get; }
        Transform Transform { get; }
        void TakeDamage(float amount, bool isCritical = false);
        void TakeDamage(float amount, Vector2 hitDirection, float knockbackStrength = 0f, bool isCritical = false);
    }
}

