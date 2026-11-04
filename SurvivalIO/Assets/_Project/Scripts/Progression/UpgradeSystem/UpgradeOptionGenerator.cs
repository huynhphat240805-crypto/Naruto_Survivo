using System.Collections.Generic;
using UnityEngine;
using SurvivalIO.Weapons;
using SurvivalIO.Skills;

namespace SurvivalIO.Progression
{
    /// <summary>
    /// Evaluates current inventory and generates randomized valid upgrade choices upon level up.
    /// </summary>
    public class UpgradeOptionGenerator : MonoBehaviour
    {
        [SerializeField] private List<UpgradeDataSO> _availableUpgrades = new List<UpgradeDataSO>();

        public List<UpgradeDataSO> GenerateOptions(int count, WeaponManager weaponMgr, SkillManager skillMgr)
        {
            List<UpgradeDataSO> eligible = new List<UpgradeDataSO>();

            foreach (var upgrade in _availableUpgrades)
            {
                if (upgrade.Category == UpgradeCategory.Weapon && upgrade.WeaponData != null)
                {
                    bool alreadyOwned = false;
                    bool canUpgrade = false;

                    if (weaponMgr != null)
                    {
                        foreach (var w in weaponMgr.EquippedWeapons)
                        {
                            if (w.UpgradeId == upgrade.WeaponData.Id)
                            {
                                alreadyOwned = true;
                                canUpgrade = w.CanUpgrade;
                                break;
                            }
                        }
                    }

                    if ((alreadyOwned && canUpgrade) || (!alreadyOwned && (weaponMgr == null || weaponMgr.HasFreeSlot)))
                    {
                        eligible.Add(upgrade);
                    }
                }
                else if (upgrade.Category == UpgradeCategory.Skill && upgrade.SkillData != null)
                {
                    bool alreadyOwned = false;
                    bool canUpgrade = false;

                    if (skillMgr != null)
                    {
                        foreach (var s in skillMgr.PassiveSkills)
                        {
                            if (s.UpgradeId == upgrade.SkillData.Id)
                            {
                                alreadyOwned = true;
                                canUpgrade = s.CanUpgrade;
                                break;
                            }
                        }
                    }

                    if ((alreadyOwned && canUpgrade) || (!alreadyOwned && (skillMgr == null || skillMgr.HasFreePassiveSlot)))
                    {
                        eligible.Add(upgrade);
                    }
                }
            }

            // Shuffle and pick
            List<UpgradeDataSO> results = new List<UpgradeDataSO>();
            List<UpgradeDataSO> pool = new List<UpgradeDataSO>(eligible);

            int targetCount = Mathf.Min(count, pool.Count);
            for (int i = 0; i < targetCount; i++)
            {
                int randomIndex = UnityEngine.Random.Range(0, pool.Count);
                results.Add(pool[randomIndex]);
                pool.RemoveAt(randomIndex);
            }

            return results;
        }
    }
}

