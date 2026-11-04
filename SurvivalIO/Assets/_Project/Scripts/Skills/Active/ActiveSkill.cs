using UnityEngine;
using SurvivalIO.Core;

namespace SurvivalIO.Skills
{
    /// <summary>
    /// Active skill implementation triggered on cooldown or user input.
    /// </summary>
    public class ActiveSkill : MonoBehaviour, ISkill
    {
        [SerializeField] private SkillDataSO _data;
        [SerializeField] private int _currentLevel = 1;
        [SerializeField] private float _cooldown = 10f;

        private float _timer;
        private Transform _user;

        public string UpgradeId => _data != null ? _data.Id : name;
        public string SkillName => _data != null ? _data.SkillName : name;
        public bool IsPassive => false;
        public int CurrentLevel => _currentLevel;
        public int MaxLevel => _data != null ? _data.MaxLevel : 1;
        public bool CanUpgrade => _currentLevel < MaxLevel;

        public void Initialize(SkillDataSO data, float cooldown)
        {
            _data = data;
            _cooldown = cooldown;
            _timer = 0f;
        }

        public void Activate(Transform user)
        {
            _user = user;
            ExecuteSkill();
        }

        public void Deactivate()
        {
            _user = null;
        }

        private void Update()
        {
            if (_user == null) return;

            _timer -= Time.deltaTime;
            if (_timer <= 0f)
            {
                ExecuteSkill();
                _timer = _cooldown;
            }
        }

        protected virtual void ExecuteSkill()
        {
            // Trigger active spell effect (e.g. temporary invulnerability or massive area explosion)
        }

        public void ApplyUpgrade()
        {
            if (CanUpgrade)
            {
                _currentLevel++;
            }
        }
    }
}

