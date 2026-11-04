using UnityEngine;
using SurvivalIO.Core;

namespace SurvivalIO.Weapons
{
    /// <summary>
    /// Abstract base class for weapons, implementing IWeapon and handling cooldown cycles.
    /// </summary>
    public abstract class WeaponBase : MonoBehaviour, IWeapon
    {
        [SerializeField] protected WeaponDataSO _data;
        [SerializeField] protected int _currentLevel = 1;
        [SerializeField] protected LayerMask _targetLayer;

        protected Transform _owner;
        protected float _cooldownTimer;
        protected WeaponModifier _modifier = new WeaponModifier();

        public string UpgradeId => _data != null ? _data.Id : name;
        public string WeaponName => _data != null ? _data.WeaponName : name;
        public int CurrentLevel => _currentLevel;
        public int MaxLevel => _data != null ? _data.MaxLevel : 1;
        public bool CanUpgrade => _currentLevel < MaxLevel;

        public float Cooldown
        {
            get
            {
                var stats = CurrentStats;
                return stats != null ? stats.Cooldown * _modifier.CooldownMultiplier : 1f;
            }
        }

        public float Damage
        {
            get
            {
                var stats = CurrentStats;
                return stats != null ? stats.Damage * _modifier.DamageMultiplier : 10f;
            }
        }

        public WeaponLevelStats CurrentStats => _data != null ? _data.GetStatsForLevel(_currentLevel) : null;
        public WeaponModifier Modifier => _modifier;

        public virtual void Initialize(Transform owner)
        {
            _owner = owner;
            _cooldownTimer = 0f;
        }

        protected virtual void Update()
        {
            if (_owner == null || CurrentStats == null) return;

            _cooldownTimer -= Time.deltaTime;
            if (_cooldownTimer <= 0f)
            {
                Fire();
                _cooldownTimer = Cooldown;
            }
        }

        public abstract void Fire();

        public virtual void ApplyUpgrade()
        {
            if (CanUpgrade)
            {
                _currentLevel++;
            }
        }
    }
}

