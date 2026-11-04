using System.Collections.Generic;
using UnityEngine;
using SurvivalIO.Core;
using SurvivalIO.Combat;
using SurvivalIO.Infrastructure;

namespace SurvivalIO.Weapons
{
    /// <summary>
    /// Base projectile component implementing IPoolable and handling collision damage delivery.
    /// </summary>
    public class Projectile : MonoBehaviour, IPoolable
    {
        [SerializeField] private ProjectileMovement _movement;
        [SerializeField] private float _lifetime = 4f;

        private float _currentLife;
        private float _damage;
        private float _knockback;
        private int _pierceRemaining;
        private LayerMask _targetMask;
        private readonly HashSet<IDamageable> _hitTargets = new HashSet<IDamageable>();

        public bool IsPooled { get; set; }

        private void Awake()
        {
            if (_movement == null)
            {
                _movement = GetComponent<ProjectileMovement>();
            }
        }

        public void Initialize(float damage, float speed, Vector2 direction, float knockback, int pierce, LayerMask targetMask)
        {
            _damage = damage;
            _knockback = knockback;
            _pierceRemaining = pierce;
            _targetMask = targetMask;
            _hitTargets.Clear();
            _currentLife = _lifetime;

            if (_movement != null)
            {
                _movement.SetSpeed(speed);
                _movement.SetDirection(direction);
            }
        }

        private void Update()
        {
            _currentLife -= Time.deltaTime;
            if (_currentLife <= 0f)
            {
                Despawn();
            }
        }

        private void OnTriggerEnter2D(Collider2D collision)
        {
            if (((1 << collision.gameObject.layer) & _targetMask) == 0)
                return;

            if (collision.TryGetComponent<IDamageable>(out var damageable))
            {
                if (damageable.IsAlive && !_hitTargets.Contains(damageable))
                {
                    _hitTargets.Add(damageable);
                    Vector2 hitDir = (damageable.Transform.position - transform.position).normalized;
                    damageable.TakeDamage(_damage, hitDir, _knockback);

                    if (_pierceRemaining > 0)
                    {
                        _pierceRemaining--;
                    }
                    else
                    {
                        Despawn();
                    }
                }
            }
        }

        public void Despawn()
        {
            if (ObjectPoolManager.Instance != null && IsPooled)
            {
                ObjectPoolManager.Instance.Despawn(gameObject.name.Replace("(Clone)", "").Trim(), gameObject);
            }
            else
            {
                gameObject.SetActive(false);
            }
        }

        public void OnSpawnFromPool()
        {
            _hitTargets.Clear();
            _currentLife = _lifetime;
        }

        public void OnReturnToPool()
        {
            _hitTargets.Clear();
        }
    }
}

