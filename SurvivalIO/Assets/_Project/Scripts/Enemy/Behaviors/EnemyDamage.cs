using UnityEngine;
using SurvivalIO.Core;

namespace SurvivalIO.Enemy
{
    /// <summary>
    /// Applies contact damage to the player upon collision contact.
    /// </summary>
    public class EnemyDamage : MonoBehaviour
    {
        [SerializeField] private float _damage = 10f;
        [SerializeField] private float _damageInterval = 0.5f;

        private float _timer;

        public void SetDamage(float damage) => _damage = damage;

        private void OnCollisionStay2D(Collision2D collision)
        {
            HandleContact(collision.collider);
        }

        private void OnTriggerStay2D(Collider2D collider)
        {
            HandleContact(collider);
        }

        private void HandleContact(Collider2D other)
        {
            _timer -= Time.deltaTime;
            if (_timer > 0f) return;

            if (other.CompareTag(GameConstants.TAG_PLAYER) && other.TryGetComponent<IDamageable>(out var damageable))
            {
                if (damageable.IsAlive)
                {
                    Vector2 dir = (damageable.Transform.position - transform.position).normalized;
                    damageable.TakeDamage(_damage, dir, 2f);
                    _timer = _damageInterval;
                }
            }
        }
    }
}

