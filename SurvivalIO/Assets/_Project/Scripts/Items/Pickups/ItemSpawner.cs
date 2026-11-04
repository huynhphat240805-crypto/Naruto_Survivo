using UnityEngine;
using SurvivalIO.Infrastructure;

namespace SurvivalIO.Items
{
    /// <summary>
    /// Utility for spawning world pickups with object pooling.
    /// </summary>
    public static class ItemSpawner
    {
        public static GameObject SpawnPickup(ItemDataSO data, Vector3 position)
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

            if (obj != null && obj.TryGetComponent<ItemPickup>(out var pickup))
            {
                pickup.Initialize(data);
            }

            return obj;
        }
    }
}

