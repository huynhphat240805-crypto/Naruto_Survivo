using UnityEngine;
using SurvivalIO.Infrastructure;

namespace SurvivalIO.Weapons
{
    /// <summary>
    /// Spawns projectiles through ObjectPoolManager or instantiates if pool unavailable.
    /// </summary>
    public static class ProjectileSpawner
    {
        public static GameObject SpawnProjectile(GameObject prefab, Vector3 position, Quaternion rotation)
        {
            if (prefab == null) return null;

            if (ObjectPoolManager.Instance != null)
            {
                string key = prefab.name;
                GameObject pooled = ObjectPoolManager.Instance.Spawn(key, position, rotation);
                if (pooled != null) return pooled;
            }

            return Object.Instantiate(prefab, position, rotation);
        }
    }
}

