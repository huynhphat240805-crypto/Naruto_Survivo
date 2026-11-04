using UnityEngine;
using SurvivalIO.Core;
using SurvivalIO.Infrastructure;

namespace SurvivalIO.Items
{
    /// <summary>
    /// Base class for dropped items in the world. Implements ICollectable and IPoolable.
    /// Moves toward the player when attracted by collection radius.
    /// </summary>
    public class ItemPickup : MonoBehaviour, ICollectable, IPoolable
    {
        [SerializeField] private ItemDataSO _data;
        [SerializeField] private float _pullSpeed = 12f;

        private Transform _targetCollector;
        private bool _isBeingCollected;

        public bool CanCollect => !_isBeingCollected;
        public bool IsPooled { get; set; }
        public ItemDataSO Data => _data;

        public void Initialize(ItemDataSO data)
        {
            _data = data;
            _targetCollector = null;
            _isBeingCollected = false;
        }

        public void Collect(Transform collector)
        {
            if (_isBeingCollected) return;

            _targetCollector = collector;
            _isBeingCollected = true;
        }

        private void Update()
        {
            if (!_isBeingCollected || _targetCollector == null) return;

            transform.position = Vector3.MoveTowards(
                transform.position,
                _targetCollector.position,
                _pullSpeed * Time.deltaTime
            );

            float distanceSqr = (transform.position - _targetCollector.position).sqrMagnitude;
            if (distanceSqr < 0.2f)
            {
                OnReachedCollector();
            }
        }

        private void OnReachedCollector()
        {
            if (_targetCollector != null && _targetCollector.TryGetComponent<ItemCollector>(out var collector))
            {
                collector.ApplyItemEffect(_data);
            }

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
            _targetCollector = null;
            _isBeingCollected = false;
        }

        public void OnReturnToPool()
        {
            _targetCollector = null;
            _isBeingCollected = false;
        }
    }
}

