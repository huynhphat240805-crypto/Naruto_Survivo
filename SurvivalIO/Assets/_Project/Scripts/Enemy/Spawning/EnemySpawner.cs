using System.Collections.Generic;
using UnityEngine;

namespace SurvivalIO.Enemy
{
    /// <summary>
    /// Spawns enemies around the player target in radial formations.
    /// </summary>
    public class EnemySpawner : MonoBehaviour
    {
        [Header("Spawn Configuration")]
        [SerializeField] private Transform _playerTarget;
        [SerializeField] private float _spawnRadiusMin = 10f;
        [SerializeField] private float _spawnRadiusMax = 15f;
        [SerializeField] private float _spawnInterval = 1f;
        [SerializeField] private int _enemiesPerBatch = 3;
        [SerializeField] private List<EnemyDataSO> _availableEnemies = new List<EnemyDataSO>();

        private float _timer;
        private bool _isSpawningActive = true;

        public void SetPlayerTarget(Transform target) => _playerTarget = target;
        public void SetSpawningActive(bool active) => _isSpawningActive = active;

        private void Update()
        {
            if (!_isSpawningActive || _playerTarget == null || _availableEnemies.Count == 0) return;

            _timer -= Time.deltaTime;
            if (_timer <= 0f)
            {
                SpawnBatch();
                _timer = _spawnInterval;
            }
        }

        private void SpawnBatch()
        {
            for (int i = 0; i < _enemiesPerBatch; i++)
            {
                EnemyDataSO randomData = _availableEnemies[UnityEngine.Random.Range(0, _availableEnemies.Count)];
                Vector3 spawnPos = GetRandomSpawnPosition();
                EnemyPool.Spawn(randomData, spawnPos, _playerTarget);
            }
        }

        private Vector3 GetRandomSpawnPosition()
        {
            Vector2 randomDir = UnityEngine.Random.insideUnitCircle.normalized;
            float distance = UnityEngine.Random.Range(_spawnRadiusMin, _spawnRadiusMax);
            Vector3 center = _playerTarget != null ? _playerTarget.position : Vector3.zero;
            return center + (Vector3)(randomDir * distance);
        }
    }
}

