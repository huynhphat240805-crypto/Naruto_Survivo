using System;
using UnityEngine;

namespace SurvivalIO.Infrastructure
{
    /// <summary>
    /// Configuration data for pre-allocating an object pool.
    /// </summary>
    [Serializable]
    public class PoolConfiguration
    {
        [SerializeField] private string _poolKey;
        [SerializeField] private GameObject _prefab;
        [SerializeField] private int _initialSize = 20;
        [SerializeField] private int _maxSize = 100;
        [SerializeField] private bool _autoExpand = true;

        public string PoolKey => string.IsNullOrEmpty(_poolKey) && _prefab != null ? _prefab.name : _poolKey;
        public GameObject Prefab => _prefab;
        public int InitialSize => _initialSize;
        public int MaxSize => _maxSize;
        public bool AutoExpand => _autoExpand;

        public PoolConfiguration() { }

        public PoolConfiguration(string key, GameObject prefab, int initialSize, int maxSize = 100, bool autoExpand = true)
        {
            _poolKey = key;
            _prefab = prefab;
            _initialSize = initialSize;
            _maxSize = maxSize;
            _autoExpand = autoExpand;
        }
    }
}

