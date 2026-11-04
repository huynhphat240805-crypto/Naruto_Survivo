using UnityEngine;
using SurvivalIO.Core;
using SurvivalIO.Infrastructure;

namespace SurvivalIO.Enemy
{
    /// <summary>
    /// Master coordinator for enemy components. Implements IPoolable for zero-GC lifecycle recycling.
    /// </summary>
    [RequireComponent(typeof(EnemyHealth))]
    [RequireComponent(typeof(EnemyMovement))]
    [RequireComponent(typeof(EnemyAI))]
    public class EnemyController : MonoBehaviour, IPoolable
    {
        [SerializeField] private EnemyDataSO _data;
        [SerializeField] private EnemyHealth _health;
        [SerializeField] private EnemyMovement _movement;
        [SerializeField] private EnemyAI _ai;
        [SerializeField] private EnemyDamage _damage;
        [SerializeField] private EnemyDropHandler _dropHandler;

        public bool IsPooled { get; set; }

        private void Awake()
        {
            _health = GetComponent<EnemyHealth>();
            _movement = GetComponent<EnemyMovement>();
            _ai = GetComponent<EnemyAI>();
            _damage = GetComponent<EnemyDamage>();
            _dropHandler = GetComponent<EnemyDropHandler>();
        }

        private void OnEnable()
        {
            if (_health != null)
            {
                _health.OnDeath += HandleDeath;
            }
        }

        private void OnDisable()
        {
            if (_health != null)
            {
                _health.OnDeath -= HandleDeath;
            }
        }

        public void Initialize(EnemyDataSO data, Transform target)
        {
            _data = data;
            _health.Initialize(data.MaxHealth, data.Armor);
            _movement.MoveSpeed = data.MoveSpeed;
            _damage?.SetDamage(data.Damage);
            _dropHandler?.SetDropTable(data.DropTable);
            _ai.Initialize(target);
        }

        private void HandleDeath()
        {
            GameEventBus.Publish(new EnemyKilledEvent
            {
                TotalKills = 1,
                EnemyType = _data != null ? _data.Id : "Enemy"
            });

            Despawn();
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
            if (_health != null && _data != null)
            {
                _health.Initialize(_data.MaxHealth, _data.Armor);
            }
        }

        public void OnReturnToPool()
        {
            _movement?.StopMovement();
        }
    }
}

