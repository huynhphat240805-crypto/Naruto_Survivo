using System.Collections.Generic;
using UnityEngine;
using SurvivalIO.Core;

namespace SurvivalIO.Infrastructure
{
    /// <summary>
    /// Generic GameObject pool implementing IPoolable lifecycle callbacks.
    /// </summary>
    public class ObjectPool
    {
        private readonly PoolConfiguration _config;
        private readonly Transform _parentTransform;
        private readonly Queue<GameObject> _poolQueue = new Queue<GameObject>();
        private readonly HashSet<GameObject> _activeObjects = new HashSet<GameObject>();

        public string Key => _config.PoolKey;
        public int TotalCount => _poolQueue.Count + _activeObjects.Count;
        public int AvailableCount => _poolQueue.Count;

        public ObjectPool(PoolConfiguration config, Transform parent)
        {
            _config = config;
            _parentTransform = parent;

            Prewarm();
        }

        private void Prewarm()
        {
            if (_config.Prefab == null)
            {
                Debug.LogError($"[ObjectPool] Prefab is missing for pool: {_config.PoolKey}");
                return;
            }

            for (int i = 0; i < _config.InitialSize; i++)
            {
                CreateNewInstance();
            }
        }

        private GameObject CreateNewInstance()
        {
            GameObject instance = Object.Instantiate(_config.Prefab, _parentTransform);
            instance.name = $"{_config.PoolKey}_{TotalCount + 1}";
            instance.SetActive(false);
            _poolQueue.Enqueue(instance);
            return instance;
        }

        public GameObject Spawn(Vector3 position, Quaternion rotation)
        {
            GameObject instance = null;

            while (_poolQueue.Count > 0 && instance == null)
            {
                instance = _poolQueue.Dequeue();
            }

            if (instance == null)
            {
                if (_config.AutoExpand && (_config.MaxSize <= 0 || TotalCount < _config.MaxSize))
                {
                    instance = CreateNewInstance();
                    _poolQueue.Dequeue(); // remove immediately for spawn
                }
                else
                {
                    Debug.LogWarning($"[ObjectPool] Pool '{_config.PoolKey}' exhausted and cannot expand.");
                    return null;
                }
            }

            instance.transform.SetPositionAndRotation(position, rotation);
            instance.SetActive(true);
            _activeObjects.Add(instance);

            IPoolable poolable = instance.GetComponent<IPoolable>();
            if (poolable != null)
            {
                poolable.IsPooled = true;
                poolable.OnSpawnFromPool();
            }

            return instance;
        }

        public void Despawn(GameObject instance)
        {
            if (instance == null) return;

            if (_activeObjects.Remove(instance))
            {
                IPoolable poolable = instance.GetComponent<IPoolable>();
                if (poolable != null)
                {
                    poolable.OnReturnToPool();
                }

                instance.SetActive(false);
                instance.transform.SetParent(_parentTransform);
                _poolQueue.Enqueue(instance);
            }
        }

        public void Clear()
        {
            foreach (var obj in _activeObjects)
            {
                if (obj != null) Object.Destroy(obj);
            }
            while (_poolQueue.Count > 0)
            {
                GameObject obj = _poolQueue.Dequeue();
                if (obj != null) Object.Destroy(obj);
            }
            _activeObjects.Clear();
        }
    }
}

