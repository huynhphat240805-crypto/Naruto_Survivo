using System.Collections.Generic;
using UnityEngine;
using SurvivalIO.Core;

namespace SurvivalIO.Skills
{
    /// <summary>
    /// Manages equipped skills and applies passive attribute modifications to the player.
    /// </summary>
    public class SkillManager : MonoBehaviour
    {
        [SerializeField] private int _maxSkills = GameConstants.MAX_PASSIVE_SKILLS;
        [SerializeField] private List<PassiveSkill> _passiveSkills = new List<PassiveSkill>();
        [SerializeField] private List<ActiveSkill> _activeSkills = new List<ActiveSkill>();

        public IReadOnlyList<PassiveSkill> PassiveSkills => _passiveSkills;
        public IReadOnlyList<ActiveSkill> ActiveSkills => _activeSkills;
        public bool HasFreePassiveSlot => _passiveSkills.Count < _maxSkills;

        public bool AddSkill(SkillDataSO data)
        {
            if (data == null) return false;

            if (data.Type == SkillType.PassiveStat)
            {
                PassiveSkill existing = _passiveSkills.Find(s => s.UpgradeId == data.Id);
                if (existing != null)
                {
                    if (existing.CanUpgrade)
                    {
                        existing.ApplyUpgrade();
                        return true;
                    }
                    return false;
                }

                if (!HasFreePassiveSlot) return false;

                GameObject skillObj = new GameObject($"[Skill] {data.SkillName}");
                skillObj.transform.SetParent(transform);

                PassiveSkill passive = skillObj.AddComponent<PassiveSkill>();
                passive.Initialize(data);
                _passiveSkills.Add(passive);
                return true;
            }
            else
            {
                ActiveSkill existing = _activeSkills.Find(s => s.UpgradeId == data.Id);
                if (existing != null)
                {
                    if (existing.CanUpgrade)
                    {
                        existing.ApplyUpgrade();
                        return true;
                    }
                    return false;
                }

                GameObject skillObj = new GameObject($"[ActiveSkill] {data.SkillName}");
                skillObj.transform.SetParent(transform);

                ActiveSkill active = skillObj.AddComponent<ActiveSkill>();
                active.Initialize(data, 10f);
                active.Activate(transform);
                _activeSkills.Add(active);
                return true;
            }
        }

        public float GetPassiveBonus(string skillId)
        {
            PassiveSkill passive = _passiveSkills.Find(s => s.UpgradeId == skillId);
            return passive != null ? passive.CurrentValue : 0f;
        }
    }
}

