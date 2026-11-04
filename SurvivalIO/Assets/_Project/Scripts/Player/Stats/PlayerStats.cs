using System;
using UnityEngine;

namespace SurvivalIO.Player
{
    /// <summary>
    /// Holds dynamic player statistics computed from base data and passive skills.
    /// </summary>
    public class PlayerStats : MonoBehaviour
    {
        [SerializeField] private float _maxHealth = 100f;
        [SerializeField] private float _moveSpeed = 5f;
        [SerializeField] private float _armor = 0f;
        [SerializeField] private float _damageMultiplier = 1f;
        [SerializeField] private float _cooldownMultiplier = 1f;
        [SerializeField] private float _pickupRange = 2.5f;
        [SerializeField] private float _critChance = 0.05f;
        [SerializeField] private float _critMultiplier = 1.5f;

        public float MaxHealth => _maxHealth;
        public float MoveSpeed => _moveSpeed;
        public float Armor => _armor;
        public float DamageMultiplier => _damageMultiplier;
        public float CooldownMultiplier => _cooldownMultiplier;
        public float PickupRange => _pickupRange;
        public float CritChance => _critChance;
        public float CritMultiplier => _critMultiplier;

        public event Action OnStatsChanged;

        public void Initialize(CharacterDataSO characterData)
        {
            if (characterData == null) return;

            _maxHealth = characterData.BaseHealth;
            _moveSpeed = characterData.BaseSpeed;
            _armor = characterData.BaseArmor;
            _pickupRange = characterData.PickupRange;
            _damageMultiplier = 1f;
            _cooldownMultiplier = 1f;

            OnStatsChanged?.Invoke();
        }

        public void ModifyMoveSpeed(float delta)
        {
            _moveSpeed = Mathf.Max(1f, _moveSpeed + delta);
            OnStatsChanged?.Invoke();
        }

        public void ModifyDamageMultiplier(float multiplier)
        {
            _damageMultiplier = Mathf.Max(0.1f, _damageMultiplier * multiplier);
            OnStatsChanged?.Invoke();
        }

        public void ModifyArmor(float delta)
        {
            _armor += delta;
            OnStatsChanged?.Invoke();
        }
    }
}

