using UnityEngine;

namespace SurvivalIO.Audio
{
    /// <summary>
    /// Controls background music playback and fading.
    /// </summary>
    public class MusicController : MonoBehaviour
    {
        [SerializeField] private AudioSource _audioSource;

        private void Awake()
        {
            if (_audioSource == null)
            {
                _audioSource = gameObject.AddComponent<AudioSource>();
            }
            _audioSource.loop = true;
            _audioSource.playOnAwake = false;
        }

        public void PlayMusic(AudioClip clip, float volume = 1f)
        {
            if (clip == null) return;
            _audioSource.clip = clip;
            _audioSource.volume = volume;
            _audioSource.Play();
        }

        public void StopMusic()
        {
            _audioSource.Stop();
        }

        public void SetVolume(float volume)
        {
            _audioSource.volume = Mathf.Clamp01(volume);
        }
    }
}

