using System;
using System.Collections.Generic;
using UnityEngine;

namespace SurvivalIO.Boss
{
    [Serializable]
    public class BossPhaseConfig
    {
        public int PhaseNumber = 1;
        [Range(0f, 1f)] public float HealthThresholdPercent = 1f;
        public float MoveSpeedMultiplier = 1f;
        public float AttackInterval = 2.5f;
        public string SpecialAttackName;
    }

    /// <summary>
    /// ScriptableObject defining multi-phase Boss attributes and phase transitions.
    /// </summary>
    [CreateAssetMenu(fileName = "NewBossData", menuName = "SurvivalIO/Data/Boss Data")]
    public class BossDataSO : ScriptableObject
    {
        [Header("Identity")]
        [SerializeField] private string _id;
        [SerializeField] private string _bossName;
        [SerializeField] private GameObject _prefab;

        [Header("Health & Resistance")]
        [SerializeField] private float _maxHealth = 2500f;
        [SerializeField] private float _baseArmor = 10f;
        [SerializeField] private float _baseSpeed = 3.5f;

        [Header("Phases")]
        [SerializeField] private List<BossPhaseConfig> _phases = new List<BossPhaseConfig>();

        public string Id => _id;
        public string BossName => _bossName;
        public GameObject Prefab => _prefab;
        public float MaxHealth => _maxHealth;
        public float BaseArmor => _baseArmor;
        public float BaseSpeed => _baseSpeed;
        public List<BossPhaseConfig> Phases => _phases;
    }
}

