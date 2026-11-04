using System;
using System.Collections.Generic;
using UnityEngine;

namespace SurvivalIO.Items
{
    [Serializable]
    public class DropTableEntry
    {
        public ItemDataSO ItemData;
        [Range(0f, 1f)] public float DropChance = 0.5f;
    }

    /// <summary>
    /// Evaluates drop chances and spawns items upon enemy demise or chest opening.
    /// </summary>
    public class ItemDropManager : MonoBehaviour
    {
        [Header("Global Drop Tables")]
        [SerializeField] private List<DropTableEntry> _defaultDrops = new List<DropTableEntry>();

        public void DropLoot(Vector3 position, List<DropTableEntry> customTable = null)
        {
            var table = (customTable != null && customTable.Count > 0) ? customTable : _defaultDrops;

            foreach (var entry in table)
            {
                if (entry.ItemData != null && UnityEngine.Random.value <= entry.DropChance)
                {
                    Vector3 offset = (Vector3)(UnityEngine.Random.insideUnitCircle * 0.4f);
                    ItemSpawner.SpawnPickup(entry.ItemData, position + offset);
                }
            }
        }
    }
}

