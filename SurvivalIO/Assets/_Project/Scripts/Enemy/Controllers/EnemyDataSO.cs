using System.Collections.Generic;
using UnityEngine;
using SurvivalIO.Items;

namespace SurvivalIO.Enemy
{
    /// <summary>
    /// ScriptableObject defining static attributes, speeds, and loot tables for enemies.
    /// </summary>
    [CreateAssetMenu(fileName = "NewEnemyData", menuName = "SurvivalIO/Data/Enemy Data")]
    public class EnemyDataSO : ScriptableObject
    {
        [Header("Identity")]
        [SerializeField] private string _id;
        [SerializeField] private string _enemyName;
        [SerializeField] private GameObject _prefab;

        [Header("Base Stats")]
        [SerializeField] private float _maxHealth = 30f;
        [SerializeField] private float _moveSpeed = 3f;
        [SerializeField] private float _damage = 10f;
        [SerializeField] private float _armor = 0f;

        [Header("Loot")]
        [SerializeField] private List<DropTableEntry> _dropTable = new List<DropTableEntry>();

        public string Id => _id;
        public string EnemyName => _enemyName;
        public GameObject Prefab => _prefab;
        public float MaxHealth => _maxHealth;
        public float MoveSpeed => _moveSpeed;
        public float Damage => _damage;
        public float Armor => _armor;
        public List<DropTableEntry> DropTable => _dropTable;
    }
}

