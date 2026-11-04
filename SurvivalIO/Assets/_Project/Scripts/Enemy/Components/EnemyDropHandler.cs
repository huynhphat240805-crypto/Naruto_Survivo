using System.Collections.Generic;
using UnityEngine;
using SurvivalIO.Items;

namespace SurvivalIO.Enemy
{
    /// <summary>
    /// Listens for enemy death and dispenses XP gems and items via ItemDropManager.
    /// </summary>
    public class EnemyDropHandler : MonoBehaviour
    {
        [SerializeField] private EnemyHealth _health;
        [SerializeField] private List<DropTableEntry> _dropTable = new List<DropTableEntry>();

        private ItemDropManager _dropManager;

        private void Awake()
        {
            if (_health == null) _health = GetComponent<EnemyHealth>();
            _dropManager = FindFirstObjectByType<ItemDropManager>();
        }

        public void SetDropTable(List<DropTableEntry> table)
        {
            _dropTable = table;
        }

        private void OnEnable()
        {
            if (_health != null)
            {
                _health.OnDeath += HandleDeathDrop;
            }
        }

        private void OnDisable()
        {
            if (_health != null)
            {
                _health.OnDeath -= HandleDeathDrop;
            }
        }

        private void HandleDeathDrop()
        {
            if (_dropManager != null)
            {
                _dropManager.DropLoot(transform.position, _dropTable);
            }
        }
    }
}

