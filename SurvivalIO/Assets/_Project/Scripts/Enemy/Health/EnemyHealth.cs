using System;
using UnityEngine;
using SurvivalIO.Core;
using SurvivalIO.Combat;

namespace SurvivalIO.Enemy
{
    /// <summary>
    /// Handles enemy hit points and damage reception. Implements IDamageable.
    /// </summary>
    public class EnemyHealth : MonoBehaviour, IDamageable
    {
        [SerializeField] private float _currentHealth = 30f;
        [SerializeField] private float _maxHealth = 30f;
        [SerializeField] private float _armor = 0f;

        private KnockbackController _knockback;

        public bool IsAlive => _currentHealth > 0f;
        public Transform Transform => transform;
        public float CurrentHealth => _currentHealth;
        public float MaxHealth => _maxHealth;

        public event Action<float, bool> OnDamageReceived;
        public event Action OnDeath;

        private void Awake()
        {
            _knockback = GetComponent<KnockbackController>();
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

            if (knockbackStrength > 0f && _knockback != null)
            {
                _knockback.ApplyKnockback(hitDirection, knockbackStrength);
            }

            OnDamageReceived?.Invoke(netDamage, isCritical);

            if (_currentHealth <= 0f)
            {
                OnDeath?.Invoke();
            }
        }
    }
}

