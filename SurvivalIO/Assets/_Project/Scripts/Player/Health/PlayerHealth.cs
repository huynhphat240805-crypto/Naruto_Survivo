using System;
using UnityEngine;
using SurvivalIO.Core;
using SurvivalIO.Combat;

namespace SurvivalIO.Player
{
    /// <summary>
    /// Manages player health pool, healing, and damage reception with invincibility frames.
    /// Implements IDamageable and IHealable.
    /// </summary>
    public class PlayerHealth : MonoBehaviour, IDamageable, IHealable
    {
        [SerializeField] private float _currentHealth = 100f;
        [SerializeField] private float _maxHealth = 100f;
        [SerializeField] private PlayerInvincibility _invincibility;
        [SerializeField] private PlayerStats _stats;

        public bool IsAlive => _currentHealth > 0f;
        public Transform Transform => transform;
        public float CurrentHealth => _currentHealth;
        public float MaxHealth => _maxHealth;
        public float HealthNormalized => Mathf.Clamp01(_currentHealth / Mathf.Max(1f, _maxHealth));

        public event Action<float, float> OnHealthChanged;
        public event Action OnPlayerDied;

        private void Awake()
        {
            if (_invincibility == null) _invincibility = GetComponent<PlayerInvincibility>();
            if (_stats == null) _stats = GetComponent<PlayerStats>();
        }

        public void Initialize(float maxHealth)
        {
            _maxHealth = maxHealth;
            _currentHealth = maxHealth;
            OnHealthChanged?.Invoke(_currentHealth, _maxHealth);
        }

        public void TakeDamage(float amount, bool isCritical = false)
        {
            TakeDamage(amount, Vector2.zero, 0f, isCritical);
        }

        public void TakeDamage(float amount, Vector2 hitDirection, float knockbackStrength = 0f, bool isCritical = false)
        {
            if (!IsAlive) return;
            if (_invincibility != null && _invincibility.IsInvincible) return;

            float armor = _stats != null ? _stats.Armor : 0f;
            float netDamage = DamageCalculator.CalculateMitigatedDamage(amount, armor);

            _currentHealth = Mathf.Max(0f, _currentHealth - netDamage);
            OnHealthChanged?.Invoke(_currentHealth, _maxHealth);

            _invincibility?.TriggerInvincibility();

            if (_currentHealth <= 0f)
            {
                OnPlayerDied?.Invoke();
                GameEventBus.Publish(new PlayerDiedEvent());
            }
        }

        public void Heal(float amount)
        {
            if (!IsAlive || amount <= 0f) return;

            _currentHealth = Mathf.Min(_maxHealth, _currentHealth + amount);
            OnHealthChanged?.Invoke(_currentHealth, _maxHealth);
        }
    }
}

