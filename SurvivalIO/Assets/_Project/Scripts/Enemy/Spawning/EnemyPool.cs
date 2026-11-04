using UnityEngine;
using SurvivalIO.Infrastructure;

namespace SurvivalIO.Enemy
{
    /// <summary>
    /// Spawner utility that leverages ObjectPoolManager for enemy allocation.
    /// </summary>
    public static class EnemyPool
    {
        public static GameObject Spawn(EnemyDataSO data, Vector3 position, Transform target)
        {
            if (data == null || data.Prefab == null) return null;

            GameObject obj = null;
            if (ObjectPoolManager.Instance != null)
            {
                obj = ObjectPoolManager.Instance.Spawn(data.Prefab.name, position, Quaternion.identity);
            }

            if (obj == null)
            {
                obj = Object.Instantiate(data.Prefab, position, Quaternion.identity);
            }

            if (obj != null && obj.TryGetComponent<EnemyController>(out var controller))
            {
                controller.Initialize(data, target);
            }

            return obj;
        }
    }
}

