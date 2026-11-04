using UnityEngine;

namespace SurvivalIO.Audio
{
    /// <summary>
    /// Controls sound effects playback with one-shots and pitch variation.
    /// </summary>
    public class SFXController : MonoBehaviour
    {
        [SerializeField] private AudioSource _audioSource;

        private void Awake()
        {
            if (_audioSource == null)
            {
                _audioSource = gameObject.AddComponent<AudioSource>();
            }
            _audioSource.loop = false;
            _audioSource.playOnAwake = false;
        }

        public void PlayOneShot(AudioClip clip, float volume = 1f, float pitch = 1f)
        {
            if (clip == null) return;
            _audioSource.pitch = pitch;
            _audioSource.PlayOneShot(clip, volume);
        }

        public void SetVolume(float volume)
        {
            _audioSource.volume = Mathf.Clamp01(volume);
        }
    }
}

