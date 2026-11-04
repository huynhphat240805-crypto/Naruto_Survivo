using UnityEngine;
using SurvivalIO.Core;

namespace SurvivalIO.Skills
{
    /// <summary>
    /// Passive skill implementation modifying player attributes.
    /// </summary>
    public class PassiveSkill : MonoBehaviour, ISkill
    {
        [SerializeField] private SkillDataSO _data;
        [SerializeField] private int _currentLevel = 1;

        public string UpgradeId => _data != null ? _data.Id : name;
        public string SkillName => _data != null ? _data.SkillName : name;
        public bool IsPassive => true;
        public int CurrentLevel => _currentLevel;
        public int MaxLevel => _data != null ? _data.MaxLevel : 1;
        public bool CanUpgrade => _currentLevel < MaxLevel;

        public float CurrentValue
        {
            get
            {
                var stats = _data != null ? _data.GetStatsForLevel(_currentLevel) : null;
                return stats != null ? stats.StatValue : 0f;
            }
        }

        public void Initialize(SkillDataSO data)
        {
            _data = data;
            _currentLevel = 1;
        }

        public void Activate(Transform user) { }

        public void Deactivate() { }

        public void ApplyUpgrade()
        {
            if (CanUpgrade)
            {
                _currentLevel++;
            }
        }
    }
}

