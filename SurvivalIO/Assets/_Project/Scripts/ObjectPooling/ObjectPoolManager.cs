using System.Collections.Generic;
using UnityEngine;
using SurvivalIO.Core;

namespace SurvivalIO.Infrastructure
{
    /// <summary>
    /// Central manager for creating, registering, and retrieving object pools.
    /// </summary>
    public class ObjectPoolManager : MonoBehaviour
    {
        private static ObjectPoolManager _instance;
        public static ObjectPoolManager Instance => _instance;

        [Header("Default Pre-allocated Pools")]
        [SerializeField] private List<PoolConfiguration> _defaultPools = new List<PoolConfiguration>();

        private readonly Dictionary<string, ObjectPool> _pools = new Dictionary<string, ObjectPool>();

        private void Awake()
        {
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }

            _instance = this;
            ServiceLocator.Register(this);

            InitializeDefaultPools();
        }

        private void InitializeDefaultPools()
        {
            foreach (var config in _defaultPools)
            {
                CreatePool(config);
            }
        }

        public void CreatePool(PoolConfiguration config)
        {
            if (config == null || string.IsNullOrEmpty(config.PoolKey)) return;

            if (_pools.ContainsKey(config.PoolKey))
            {
                Debug.LogWarning($"[ObjectPoolManager] Pool with key '{config.PoolKey}' already exists.");
                return;
            }

            GameObject poolHost = new GameObject($"[Pool] {config.PoolKey}");
            poolHost.transform.SetParent(transform);

            ObjectPool pool = new ObjectPool(config, poolHost.transform);
            _pools.Add(config.PoolKey, pool);
        }

        public GameObject Spawn(string poolKey, Vector3 position, Quaternion rotation)
        {
            if (_pools.TryGetValue(poolKey, out ObjectPool pool))
            {
                return pool.Spawn(position, rotation);
            }

            Debug.LogError($"[ObjectPoolManager] No pool registered with key: '{poolKey}'");
            return null;
        }

        public void Despawn(string poolKey, GameObject instance)
        {
            if (_pools.TryGetValue(poolKey, out ObjectPool pool))
            {
                pool.Despawn(instance);
            }
            else
            {
                Destroy(instance);
            }
        }

        private void OnDestroy()
        {
            if (_instance == this)
            {
                ServiceLocator.Unregister<ObjectPoolManager>();
            }
        }
    }
}

