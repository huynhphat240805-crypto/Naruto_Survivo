using System.Collections.Generic;
using UnityEngine;
using SurvivalIO.Weapons;
using SurvivalIO.Skills;

namespace SurvivalIO.Progression
{
    /// <summary>
    /// Evaluates weapon and skill combinations for 6-star Evolution / Awakening.
    /// </summary>
    public class EvolutionManager : MonoBehaviour
    {
        [SerializeField] private List<SkillEvolution> _evolutions = new List<SkillEvolution>();

        public bool CheckEvolutionReady(string weaponId, int weaponLevel, SkillManager skillMgr, out SkillEvolution matchedEvolution)
        {
            matchedEvolution = null;

            foreach (var evo in _evolutions)
            {
                if (evo.RequiredWeaponId == weaponId && weaponLevel >= evo.RequiredWeaponLevel)
                {
                    int passiveLevel = 0;
                    if (skillMgr != null)
                    {
                        foreach (var s in skillMgr.PassiveSkills)
                        {
                            if (s.UpgradeId == evo.RequiredPassiveId)
                            {
                                passiveLevel = s.CurrentLevel;
                                break;
                            }
                        }
                    }

                    if (passiveLevel >= evo.RequiredPassiveLevel)
                    {
                        matchedEvolution = evo;
                        return true;
                    }
                }
            }

            return false;
        }
    }
}

