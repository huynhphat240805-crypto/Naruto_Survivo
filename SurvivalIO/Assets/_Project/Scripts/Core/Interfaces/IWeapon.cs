using UnityEngine;

namespace SurvivalIO.Core
{
    /// <summary>
    /// Contract for weapon systems.
    /// </summary>
    public interface IWeapon : IUpgradeable
    {
        string WeaponName { get; }
        float Cooldown { get; }
        float Damage { get; }
        void Initialize(Transform owner);
        void Fire();
    }
}

