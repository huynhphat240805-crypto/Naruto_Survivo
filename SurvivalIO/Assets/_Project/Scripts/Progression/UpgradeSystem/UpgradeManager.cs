using System;
using System.Collections.Generic;
using UnityEngine;
using SurvivalIO.Core;
using SurvivalIO.Weapons;
using SurvivalIO.Skills;

namespace SurvivalIO.Progression
{
    /// <summary>
    /// Coordinates the full level-up lifecycle: pause, option generation, player choice, application, resume.
    /// </summary>
    public class UpgradeManager : MonoBehaviour
    {
        [SerializeField] private UpgradeOptionGenerator _optionGenerator;
        [SerializeField] private WeaponManager _weaponManager;
        [SerializeField] private SkillManager _skillManager;
        [SerializeField] private LayerMask _weaponTargetLayer;

        public event Action<List<UpgradeDataSO>> OnUpgradeOptionsReady;
        public event Action OnUpgradeCompleted;

        private void Awake()
        {
            if (_optionGenerator == null)
            {
                _optionGenerator = GetComponent<UpgradeOptionGenerator>();
            }
        }

        public void BindCharacterManagers(WeaponManager weaponMgr, SkillManager skillMgr, LayerMask targetLayer)
        {
            _weaponManager = weaponMgr;
            _skillManager = skillMgr;
            _weaponTargetLayer = targetLayer;
        }

        public void TriggerLevelUpChoice()
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.TriggerLevelUp();
            }

            var options = _optionGenerator != null
                ? _optionGenerator.GenerateOptions(3, _weaponManager, _skillManager)
                : new List<UpgradeDataSO>();

            OnUpgradeOptionsReady?.Invoke(options);
        }

        public void SelectUpgrade(UpgradeDataSO upgrade)
        {
            if (upgrade != null)
            {
                ApplyUpgrade(upgrade);
            }

            if (GameManager.Instance != null)
            {
                GameManager.Instance.ResumeMatch();
            }

            OnUpgradeCompleted?.Invoke();
        }

        private void ApplyUpgrade(UpgradeDataSO upgrade)
        {
            if (upgrade.Category == UpgradeCategory.Weapon && upgrade.WeaponData != null)
            {
                _weaponManager?.AddWeapon(upgrade.WeaponData, _weaponTargetLayer);
            }
            else if (upgrade.Category == UpgradeCategory.Skill && upgrade.SkillData != null)
            {
                _skillManager?.AddSkill(upgrade.SkillData);
            }
        }
    }
}

