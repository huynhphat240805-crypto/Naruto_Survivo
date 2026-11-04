using System;
using UnityEngine;
using SurvivalIO.Core;

namespace SurvivalIO.Combat
{
    /// <summary>
    /// Component attached to entities that can receive damage, knockback, and status effects.
    /// Implements IDamageable interface.
    /// </summary>
    public class DamageReceiver : MonoBehaviour, IDamageable
    {
        [SerializeField] private float _currentHealth = 100f;
        [SerializeField] private float _maxHealth = 100f;
        [SerializeField] private float _armor = 0f;

        private KnockbackController _knockbackController;
        private StatusEffectController _statusEffectController;

        public bool IsAlive => _currentHealth > 0f;
        public Transform Transform => transform;
        public float CurrentHealth => _currentHealth;
        public float MaxHealth => _maxHealth;

        public event Action<DamageInfo> OnDamageTaken;
        public event Action OnDied;

        private void Awake()
        {
            _knockbackController = GetComponent<KnockbackController>();
            _statusEffectController = GetComponent<StatusEffectController>();
        }

        public void Initialize(float maxHealth, float armor = 0f)
        {
            _maxHealth = maxHealth;
            _currentHealth = maxHealth;
            _armor = armor;
        }

        public void TakeDamage(float amount, bool isCritical = false)
        {
            TakeDamage(amount, Vector2.zero, 0f, isCritical);
        }

        public void TakeDamage(float amount, Vector2 hitDirection, float knockbackStrength = 0f, bool isCritical = false)
        {
            if (!IsAlive) return;

            float netDamage = DamageCalculator.CalculateMitigatedDamage(amount, _armor);
            _currentHealth = Mathf.Max(0f, _currentHealth - netDamage);

            if (knockbackStrength > 0f && _knockbackController != null)
            {
                _knockbackController.ApplyKnockback(hitDirection, knockbackStrength);
            }

            DamageInfo info = new DamageInfo(netDamage, hitDirection, knockbackStrength, isCritical, gameObject);
            OnDamageTaken?.Invoke(info);

            if (_currentHealth <= 0f)
            {
                OnDied?.Invoke();
            }
        }

        public void TakeDamage(DamageInfo info)
        {
            TakeDamage(info.Amount, info.Direction, info.KnockbackForce, info.IsCritical);

            if (info.StatusEffect != StatusEffectType.None && _statusEffectController != null)
            {
                _statusEffectController.ApplyEffect(new StatusEffectData(info.StatusEffect, 3f, 0.5f, 5f));
            }
        }
    }
}

